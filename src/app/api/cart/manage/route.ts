import { NextRequest, NextResponse } from "next/server";

const STORE_HASH = process.env.BIGCOMMERCE_STORE_HASH!;
const ACCESS_TOKEN = process.env.BIGCOMMERCE_ACCESS_TOKEN!;

// BigCommerce REST Management API for server-side cart operations
const BC_REST = `https://api.bigcommerce.com/stores/${STORE_HASH}/v3`;

const headers = {
  "X-Auth-Token": ACCESS_TOKEN,
  "Content-Type": "application/json",
  Accept: "application/json",
};

// GET /api/cart/manage?cartId=xxx — fetch full cart with product details
export async function GET(request: NextRequest) {
  try {
    const cartId = request.nextUrl.searchParams.get("cartId");

    if (!cartId) {
      return NextResponse.json({ cart: null });
    }

    // Fetch cart from BC REST API (includes line items with full details)
    const cartRes = await fetch(`${BC_REST}/carts/${cartId}?include=line_items.physical_items.options,line_items.digital_items.options`, {
      headers,
    });

    if (!cartRes.ok) {
      if (cartRes.status === 404) {
        return NextResponse.json({ cart: null });
      }
      return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 });
    }

    const cartData = await cartRes.json();
    const cart = cartData.data;

    if (!cart) {
      return NextResponse.json({ cart: null });
    }

    // Map physical items to clean structure
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
    const body = await request.json();
    const { action, cartId, productId, variantId, quantity } = body;

    if (action === "create" || !cartId) {
      // Create new cart with items
      const createRes = await fetch(`${BC_REST}/carts`, {
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

      if (!createRes.ok) {
        const err = await createRes.json().catch(() => null);
        console.error("Create cart failed:", err);
        return NextResponse.json({ error: "Failed to create cart" }, { status: 500 });
      }

      const data = await createRes.json();
      return NextResponse.json({ cartId: data.data?.id });
    }

    if (action === "add") {
      // Add item to existing cart
      const addRes = await fetch(`${BC_REST}/carts/${cartId}/items`, {
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

      return NextResponse.json({ success: true });
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

      return NextResponse.json({ success: true, cleared: true });
    }
  } catch (err) {
    console.error("Cart manage DELETE error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
