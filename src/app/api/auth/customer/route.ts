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

    // Fetch customer details from BigCommerce V3
    const customerRes = await fetch(
      `https://api.bigcommerce.com/stores/${STORE_HASH}/v3/customers?id:in=${customerId}&include=addresses`,
      {
        headers: {
          "X-Auth-Token": ACCESS_TOKEN,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    if (!customerRes.ok) {
      return NextResponse.json({ error: "Failed to fetch customer data" }, { status: 500 });
    }

    const customerData = await customerRes.json();
    const customer = customerData.data?.[0];

    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    // Parse addresses
    const addresses = (customer.addresses || []).map((addr: {
      id: number;
      first_name: string;
      last_name: string;
      address1: string;
      address2?: string;
      city: string;
      state_or_province: string;
      postal_code: string;
      country: string;
      phone?: string;
    }) => ({
      id: addr.id,
      name: `${addr.first_name} ${addr.last_name}`,
      line1: addr.address1,
      line2: addr.address2 || "",
      city: addr.city,
      state: addr.state_or_province,
      zip: addr.postal_code,
      country: addr.country,
      phone: addr.phone || "",
      formatted: `${addr.address1}${addr.address2 ? ", " + addr.address2 : ""}, ${addr.city}, ${addr.state_or_province} ${addr.postal_code}`,
    }));

    return NextResponse.json({
      customer: {
        id: customer.id,
        email: customer.email,
        firstName: customer.first_name,
        lastName: customer.last_name,
        phone: customer.phone || "",
        dateCreated: customer.date_created,
        addresses,
      },
    });
  } catch (err) {
    console.error("Customer fetch error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
