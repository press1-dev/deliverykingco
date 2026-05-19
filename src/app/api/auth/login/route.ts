import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const STORE_HASH = process.env.BIGCOMMERCE_STORE_HASH!;
const ACCESS_TOKEN = process.env.BIGCOMMERCE_ACCESS_TOKEN!;
const AUTH_SECRET = process.env.AUTH_SECRET!;

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password + AUTH_SECRET).digest("hex");
}

function createSession(customer: { id: number; email: string; first_name: string; last_name: string; phone?: string }) {
  const sessionPayload = {
    id: customer.id,
    email: customer.email,
    firstName: customer.first_name,
    lastName: customer.last_name,
    phone: customer.phone || "",
    exp: Date.now() + 30 * 24 * 60 * 60 * 1000,
  };

  const token = Buffer.from(JSON.stringify(sessionPayload)).toString("base64");
  const signature = crypto
    .createHmac("sha256", AUTH_SECRET)
    .update(token)
    .digest("hex");

  return { token, signature, sessionPayload };
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    // Search for customer by email
    const searchRes = await fetch(
      `https://api.bigcommerce.com/stores/${STORE_HASH}/v3/customers?email:in=${encodeURIComponent(email)}`,
      {
        headers: {
          "X-Auth-Token": ACCESS_TOKEN,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    if (!searchRes.ok) {
      console.error("BC customer search failed:", searchRes.status);
      return NextResponse.json(
        { error: "Authentication service error. Please try again." },
        { status: 500 }
      );
    }

    const searchData = await searchRes.json();
    const customers = searchData.data;

    if (!customers || customers.length === 0) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    const customer = customers[0];

    // Validate password via BigCommerce V3
    const validateRes = await fetch(
      `https://api.bigcommerce.com/stores/${STORE_HASH}/v3/customers/validate-credentials`,
      {
        method: "POST",
        headers: {
          "X-Auth-Token": ACCESS_TOKEN,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, password }),
      }
    );

    let credentialsValid = false;
    if (validateRes.ok) {
      const validateData = await validateRes.json();
      credentialsValid = !!validateData?.is_valid;
    }

    // Fallback: local hash check
    if (!credentialsValid) {
      const storedHash = customer.notes || "";
      const inputHash = hashPassword(password);
      if (storedHash !== inputHash) {
        return NextResponse.json(
          { error: "Invalid email or password." },
          { status: 401 }
        );
      }
    }

    // Success - create session
    const { token, signature } = createSession(customer);

    const response = NextResponse.json({
      success: true,
      user: {
        id: customer.id,
        email: customer.email,
        firstName: customer.first_name,
        lastName: customer.last_name,
        phone: customer.phone || "",
      },
    });

    response.cookies.set("dk_session", `${token}.${signature}`, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
