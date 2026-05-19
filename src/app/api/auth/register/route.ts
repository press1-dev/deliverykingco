import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const STORE_HASH = process.env.BIGCOMMERCE_STORE_HASH!;
const ACCESS_TOKEN = process.env.BIGCOMMERCE_ACCESS_TOKEN!;
const AUTH_SECRET = process.env.AUTH_SECRET!;

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password + AUTH_SECRET).digest("hex");
}

export async function POST(request: NextRequest) {
  try {
    const { email, password, firstName, lastName } = await request.json();

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 }
      );
    }

    // Check if customer already exists
    const existingRes = await fetch(
      `https://api.bigcommerce.com/stores/${STORE_HASH}/v3/customers?email:in=${encodeURIComponent(email)}`,
      {
        headers: {
          "X-Auth-Token": ACCESS_TOKEN,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    if (existingRes.ok) {
      const existingData = await existingRes.json();
      if (existingData.data && existingData.data.length > 0) {
        return NextResponse.json(
          { error: "An account with this email already exists." },
          { status: 409 }
        );
      }
    }

    // Create customer in BigCommerce V3 API
    const passwordHash = hashPassword(password);

    const createRes = await fetch(
      `https://api.bigcommerce.com/stores/${STORE_HASH}/v3/customers`,
      {
        method: "POST",
        headers: {
          "X-Auth-Token": ACCESS_TOKEN,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify([
          {
            email,
            first_name: firstName,
            last_name: lastName,
            notes: passwordHash,
            authentication: {
              new_password: password,
            },
          },
        ]),
      }
    );

    if (!createRes.ok) {
      const errData = await createRes.json().catch(() => null);
      console.error("BC create customer failed:", createRes.status, errData);
      return NextResponse.json(
        { error: "Could not create account. Please try again." },
        { status: 500 }
      );
    }

    const createData = await createRes.json();
    const customer = createData.data?.[0];

    if (!customer) {
      return NextResponse.json(
        { error: "Account creation failed. Please try again." },
        { status: 500 }
      );
    }

    // Auto-login: create session token
    const sessionPayload = {
      id: customer.id,
      email: customer.email,
      firstName: customer.first_name,
      lastName: customer.last_name,
      exp: Date.now() + 30 * 24 * 60 * 60 * 1000,
    };

    const token = Buffer.from(JSON.stringify(sessionPayload)).toString("base64");
    const signature = crypto
      .createHmac("sha256", AUTH_SECRET)
      .update(token)
      .digest("hex");

    const response = NextResponse.json({
      success: true,
      user: {
        id: customer.id,
        email: customer.email,
        firstName: customer.first_name,
        lastName: customer.last_name,
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
    console.error("Register error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
