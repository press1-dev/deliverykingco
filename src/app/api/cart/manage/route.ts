import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const STORE_HASH = process.env.BIGCOMMERCE_STORE_HASH!;
const ACCESS_TOKEN = process.env.BIGCOMMERCE_ACCESS_TOKEN!;
const AUTH_SECRET = process.env.AUTH_SECRET!;

// BigCommerce REST Management API for server-side cart operations
const BC_REST = `https://api.bigcommerce.com/stores/${STORE_HASH}/v3`;

const headers = {
  "X-Auth-Token": ACCESS_TOKEN,
  "Content-Type": "application/json",
  Accept: "application/json",
};

// Helper: Decode dk_session to get customer_id
function getCustomerIdFromSession(request: NextRequest): number | null {
  try {
    const cookie = request.cookies.get("dk_session")?.value;
    if (!cookie) return null;

    const [token, signature] = cookie.split(".");
    if (!token || !signature) return null;

    const expectedSignature = crypto
      .createHmac("sha256", AUTH_SECRET)
      .update(token)
      .digest("hex");

    if (signature !== expectedSignature) return null;

    const payload = JSON.parse(Buffer.from(token, "base64").toString("utf-8"));
    if (payload.exp && payload.exp < Date.now()) return null;

    return payload.id || null;
  } catch {
    return null;
  }
}

// Helper: Get cartId from Customer Metafield
async function getCustomerCartId(customerId: number): Promise<string | null> {
  try {
    const res = await fetch(`${BC_REST}/customers/${customerId}/metafields`, {
      headers,
    });
    if (!res.ok) return null;
    const data = await res.json();
    const metafields = data.data || [];
    const cartMeta = metafields.find(
      (m: { namespace: string; key: string; value: string }) =>
        m.namespace === "deliveryking" && m.key === "cart_id"
    );
    return cartMeta ? cartMeta.value : null;
  } catch (err) {
    console.error("Error getting customer cart ID metafield:", err);
    return null;
  }
}

// Helper: Set cartId to Customer Metafield
async function setCustomerCartId(customerId: number, cartId: string | null): Promise<void> {
  try {
    // Fetch metafields to find existing
    const getRes = await fetch(`${BC_REST}/customers/${customerId}/metafields`, {
      headers,
    });
    let existingMetafieldId: number | null = null;
    if (getRes.ok) {
      const data = await getRes.json();
      const existing = (data.data || []).find(
        (m: { namespace: string; key: string; id: number }) =>
          m.namespace === "deliveryking" && m.key === "cart_id"
      );
      if (existing) {
        existingMetafieldId = existing.id;
      }
    }

    if (cartId === null) {
      // Clear metafield if cart is deleted
      if (existingMetafieldId) {
        await fetch(`${BC_REST}/customers/${customerId}/metafields/${existingMetafieldId}`, {
          method: "DELETE",
          headers,
        });
      }
      return;
    }

    if (existingMetafieldId) {
      // Update existing metafield
      await fetch(`${BC_REST}/customers/${customerId}/metafields/${existingMetafieldId}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({
          value: cartId,
        }),
      });
    } else {
      // Create new metafield
      await fetch(`${BC_REST}/customers/${customerId}/metafields`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          permission_set: "app_only",
          namespace: "deliveryking",
          key: "cart_id",
          value: cartId,
          description: "Persistent BigCommerce Cart ID for customer account",
        }),
      });
    }
  } catch (err) {
    console.error("Error setting customer cart ID metafield:", err);
  }
}

// Helper: Update a cart's customer_id (Associate cart with logged-in user)
async function associateCartWithCustomer(cartId: string, customerId: number): Promise<boolean> {
  try {
    const res = await fetch(`${BC_REST}/carts/${cartId}`, {
      method: "PUT",
      headers,
      body: JSON.stringify({
        customer_id: customerId,
      }),
    });
    return res.ok;
  } catch (err) {
    console.error("Error associating cart with customer:", err);
    return false;
  }
}

// GET /api/cart/manage?cartId=xxx — fetch full cart with product details
export async function GET(request: NextRequest) {
  try {
    const customerId = getCustomerIdFromSession(request);
    const guestCartId = request.nextUrl.searchParams.get("cartId");

    let activeCartId: string | null = guestCartId;

    if (customerId) {
      // User is logged in — fetch their saved cart ID from their metafields
      const savedCartId = await getCustomerCartId(customerId);

      if (savedCartId) {
        // They have a saved cart in their profile!
        activeCartId = savedCartId;

        // If they also have a guest cart in their local storage, merge them!
        if (guestCartId && guestCartId !== savedCartId) {
          try {
            // Fetch the items from the guest cart
            const guestRes = await fetch(`${BC_REST}/carts/${guestCartId}`, { headers });
            if (guestRes.ok) {
              const guestData = await guestRes.json();
              const guestItems = guestData.data?.line_items?.physical_items || [];

              if (guestItems.length > 0) {
                // Add guest items to the saved customer cart
                const itemsToAdd = guestItems.map((item: { product_id: number; variant_id: number; quantity: number }) => ({
                  product_id: item.product_id,
                  variant_id: item.variant_id || undefined,
                  quantity: item.quantity,
                }));

                await fetch(`${BC_REST}/carts/${savedCartId}/items`, {
                  method: "POST",
                  headers,
                  body: JSON.stringify({
                    line_items: itemsToAdd,
                  }),
                });
              }

              // Delete guest cart since it's merged
              await fetch(`${BC_REST}/carts/${guestCartId}`, { method: "DELETE", headers });
            }
          } catch (mergeErr) {
            console.error("Failed to merge guest cart into customer cart:", mergeErr);
          }
        }
      } else if (guestCartId) {
        // They are logged in, don't have a saved cart, but have a guest cart — associate it!
        const success = await associateCartWithCustomer(guestCartId, customerId);
        if (success) {
          await setCustomerCartId(customerId, guestCartId);
          activeCartId = guestCartId;
        }
      }
    }

    if (!activeCartId) {
      return NextResponse.json({ cart: null });
    }

    // Fetch cart from BC REST API
    const cartRes = await fetch(
      `${BC_REST}/carts/${activeCartId}?include=line_items.physical_items.options,line_items.digital_items.options`,
      { headers }
    );

    if (!cartRes.ok) {
      if (cartRes.status === 404) {
        // Cart not found or expired
        if (customerId) {
          await setCustomerCartId(customerId, null);
        }
        return NextResponse.json({ cart: null });
      }
      return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 });
    }

    const cartData = await cartRes.json();
    const cart = cartData.data;

    if (!cart) {
      return NextResponse.json({ cart: null });
    }

    // Map physical items
    const physicalItems = (cart.line_items?.physical_items || []).map(
      (item: {
        id: string;
        product_id: number;
        variant_id: number;
        name: string;
        quantity: number;
        list_price: number;
        sale_price: number;
        extended_list_price: number;
        extended_sale_price: number;
        image_url: string;
        options: Array<{ name: string; value: string }>;
        sku: string;
      }) => ({
        id: item.id,
        productId: item.product_id,
        variantId: item.variant_id,
        name: item.name,
        quantity: item.quantity,
        listPrice: item.list_price,
        salePrice: item.sale_price,
        extendedListPrice: item.extended_list_price,
        extendedSalePrice: item.extended_sale_price,
        imageUrl: item.image_url || "",
        options: (item.options || []).map((opt: { name: string; value: string }) => ({
          name: opt.name,
          value: opt.value,
        })),
        sku: item.sku || "",
      })
    );

    // Map digital items
    const digitalItems = (cart.line_items?.digital_items || []).map(
      (item: {
        id: string;
        product_id: number;
        variant_id: number;
        name: string;
        quantity: number;
        list_price: number;
        sale_price: number;
        extended_list_price: number;
        extended_sale_price: number;
        image_url: string;
        options: Array<{ name: string; value: string }>;
      }) => ({
        id: item.id,
        productId: item.product_id,
        variantId: item.variant_id,
        name: item.name,
        quantity: item.quantity,
        listPrice: item.list_price,
        salePrice: item.sale_price,
        extendedListPrice: item.extended_list_price,
        extendedSalePrice: item.extended_sale_price,
        imageUrl: item.image_url || "",
        options: (item.options || []).map((opt: { name: string; value: string }) => ({
          name: opt.name,
          value: opt.value,
        })),
      })
    );

    return NextResponse.json({
      cart: {
        id: cart.id,
        customerId: cart.customer_id,
        baseAmount: cart.base_amount,
        discountAmount: cart.discount_amount,
        taxIncluded: cart.tax_included,
        cartAmount: cart.cart_amount,
        currency: cart.currency?.code || "USD",
        createdTime: cart.created_time,
        updatedTime: cart.updated_time,
        items: [...physicalItems, ...digitalItems],
        itemCount: physicalItems.reduce((acc: number, i: { quantity: number }) => acc + i.quantity, 0) +
          digitalItems.reduce((acc: number, i: { quantity: number }) => acc + i.quantity, 0),
      },
    });
  } catch (err) {
    console.error("Cart manage GET error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// POST /api/cart/manage — create cart or add items
export async function POST(request: NextRequest) {
  try {
    const customerId = getCustomerIdFromSession(request);
    const body = await request.json();
    const { action, cartId, productId, variantId, quantity } = body;

    let targetCartId = cartId;

    // If customer is logged in, check if they already have a saved cart ID
    if (customerId && !targetCartId) {
      const saved = await getCustomerCartId(customerId);
      if (saved) {
        targetCartId = saved;
      }
    }

    if (action === "create" || !targetCartId) {
      // Create new cart with items
      const payload: {
        line_items: Array<{ product_id: number; variant_id?: number; quantity: number }>;
        customer_id?: number;
      } = {
        line_items: [
          {
            product_id: productId,
            variant_id: variantId || undefined,
            quantity: quantity || 1,
          },
        ],
      };

      if (customerId) {
        payload.customer_id = customerId;
      }

      const createRes = await fetch(`${BC_REST}/carts`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      if (!createRes.ok) {
        const err = await createRes.json().catch(() => null);
        console.error("Create cart failed:", err);
        return NextResponse.json({ error: "Failed to create cart" }, { status: 500 });
      }

      const data = await createRes.json();
      const newCartId = data.data?.id;

      // Save the new cart ID to customer metafields if logged in
      if (customerId && newCartId) {
        await setCustomerCartId(customerId, newCartId);
      }

      return NextResponse.json({ cartId: newCartId });
    }

    if (action === "add") {
      // Add item to existing cart
      const addRes = await fetch(`${BC_REST}/carts/${targetCartId}/items`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          line_items: [
            {
              product_id: productId,
              variant_id: variantId || undefined,
              quantity: quantity || 1,
            },
          ],
        }),
      });

      if (!addRes.ok) {
        const err = await addRes.json().catch(() => null);
        console.error("Add item failed:", err);
        return NextResponse.json({ error: "Failed to add item" }, { status: 500 });
      }

      return NextResponse.json({ success: true, cartId: targetCartId });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err) {
    console.error("Cart manage POST error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// PUT /api/cart/manage — update item quantity
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { cartId, itemId, productId, variantId, quantity } = body;

    if (!cartId || !itemId) {
      return NextResponse.json({ error: "cartId and itemId required" }, { status: 400 });
    }

    const updateRes = await fetch(`${BC_REST}/carts/${cartId}/items/${itemId}`, {
      method: "PUT",
      headers,
      body: JSON.stringify({
        line_item: {
          product_id: productId,
          variant_id: variantId || undefined,
          quantity,
        },
      }),
    });

    if (!updateRes.ok) {
      const err = await updateRes.json().catch(() => null);
      console.error("Update item failed:", err);
      return NextResponse.json({ error: "Failed to update item" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Cart manage PUT error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// DELETE /api/cart/manage — remove item or clear cart
export async function DELETE(request: NextRequest) {
  try {
    const customerId = getCustomerIdFromSession(request);
    const { searchParams } = new URL(request.url);
    const cartId = searchParams.get("cartId");
    const itemId = searchParams.get("itemId");

    if (!cartId) {
      return NextResponse.json({ error: "cartId required" }, { status: 400 });
    }

    if (itemId) {
      // Delete single item
      const deleteRes = await fetch(`${BC_REST}/carts/${cartId}/items/${itemId}`, {
        method: "DELETE",
        headers,
      });

      if (!deleteRes.ok && deleteRes.status !== 204) {
        return NextResponse.json({ error: "Failed to remove item" }, { status: 500 });
      }

      return NextResponse.json({ success: true });
    } else {
      // Delete entire cart
      const deleteRes = await fetch(`${BC_REST}/carts/${cartId}`, {
        method: "DELETE",
        headers,
      });

      if (!deleteRes.ok && deleteRes.status !== 204) {
        return NextResponse.json({ error: "Failed to clear cart" }, { status: 500 });
      }

      if (customerId) {
        await setCustomerCartId(customerId, null);
      }

      return NextResponse.json({ success: true, cleared: true });
    }
  } catch (err) {
    console.error("Cart manage DELETE error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
