import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const STORE_HASH = process.env.BIGCOMMERCE_STORE_HASH!;
const ACCESS_TOKEN = process.env.BIGCOMMERCE_ACCESS_TOKEN!;
const AUTH_SECRET = process.env.AUTH_SECRET!;

function getSessionUser(request: NextRequest) {
  const cookie = request.cookies.get("dk_session")?.value;
  if (!cookie) return null;

  const [token, signature] = cookie.split(".");
  if (!token || !signature) return null;

  const expectedSig = crypto.createHmac("sha256", AUTH_SECRET).update(token).digest("hex");
  if (signature !== expectedSig) return null;

  const payload = JSON.parse(Buffer.from(token, "base64").toString("utf-8"));
  if (payload.exp && payload.exp < Date.now()) return null;

  return payload;
}

export async function GET(request: NextRequest) {
  try {
    const session = getSessionUser(request);
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const customerId = session.id;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    // Fetch orders from BigCommerce V2 Orders API
    const ordersRes = await fetch(
      `https://api.bigcommerce.com/stores/${STORE_HASH}/v2/orders?customer_id=${customerId}&page=${page}&limit=${limit}&sort=date_created:desc`,
      {
        headers: {
          "X-Auth-Token": ACCESS_TOKEN,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    // BigCommerce V2 returns 204 for empty results
    if (ordersRes.status === 204) {
      return NextResponse.json({ orders: [], totalCount: 0 });
    }

    if (!ordersRes.ok) {
      console.error("BC orders fetch failed:", ordersRes.status);
      return NextResponse.json({ orders: [], totalCount: 0 });
    }

    const ordersData = await ordersRes.json();

    // Fetch order count for pagination
    const countRes = await fetch(
      `https://api.bigcommerce.com/stores/${STORE_HASH}/v2/orders/count?customer_id=${customerId}`,
      {
        headers: {
          "X-Auth-Token": ACCESS_TOKEN,
          Accept: "application/json",
        },
      }
    );

    let totalCount = 0;
    if (countRes.ok) {
      const countData = await countRes.json();
      totalCount = countData.count || 0;
    }

    // Map BigCommerce order status codes to display strings
    const statusMap: Record<number, string> = {
      0: "INCOMPLETE",
      1: "PENDING",
      2: "SHIPPED",
      3: "PARTIALLY_SHIPPED",
      4: "REFUNDED",
      5: "CANCELLED",
      6: "DECLINED",
      7: "AWAITING_PAYMENT",
      8: "AWAITING_PICKUP",
      9: "AWAITING_SHIPMENT",
      10: "COMPLETED",
      11: "AWAITING_FULFILLMENT",
      12: "MANUAL_VERIFICATION_REQUIRED",
      13: "DISPUTED",
      14: "PARTIALLY_REFUNDED",
    };

    const orders = (Array.isArray(ordersData) ? ordersData : []).map(
      (order: {
        id: number;
        status_id: number;
        status: string;
        date_created: string;
        total_inc_tax: string;
        items_total: number;
        products?: { url: string };
        billing_address?: { first_name: string; last_name: string };
      }) => ({
        id: order.id,
        orderId: `#DK-${order.id}`,
        status: statusMap[order.status_id] || order.status?.toUpperCase() || "UNKNOWN",
        statusRaw: order.status,
        date: new Date(order.date_created).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        total: parseFloat(order.total_inc_tax),
        itemCount: order.items_total || 0,
        productsUrl: order.products?.url || null,
      })
    );

    // Fetch product names for each order (first product name)
    const ordersWithProducts = await Promise.all(
      orders.map(async (order: { id: number; orderId: string; status: string; statusRaw: string; date: string; total: number; itemCount: number; productsUrl: string | null }) => {
        if (!order.productsUrl) {
          return { ...order, productName: `Order ${order.orderId}` };
        }

        try {
          const productsRes = await fetch(
            `https://api.bigcommerce.com/stores/${STORE_HASH}/v2/orders/${order.id}/products?limit=1`,
            {
              headers: {
                "X-Auth-Token": ACCESS_TOKEN,
                Accept: "application/json",
              },
            }
          );

          if (productsRes.ok) {
            const products = await productsRes.json();
            const firstName = products?.[0]?.name || `Order ${order.orderId}`;
            const suffix = order.itemCount > 1 ? ` +${order.itemCount - 1} more` : "";
            return { ...order, productName: firstName + suffix };
          }
        } catch {
          // Ignore fetch errors for products
        }

        return { ...order, productName: `Order ${order.orderId}` };
      })
    );

    return NextResponse.json({
      orders: ordersWithProducts,
      totalCount,
      page,
      limit,
    });
  } catch (err) {
    console.error("Orders fetch error:", err);
    return NextResponse.json({ orders: [], totalCount: 0 }, { status: 500 });
  }
}
