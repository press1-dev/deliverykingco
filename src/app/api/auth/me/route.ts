import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const AUTH_SECRET = process.env.AUTH_SECRET!;

export async function GET(request: NextRequest) {
  try {
    const cookie = request.cookies.get("dk_session")?.value;

    if (!cookie) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const [token, signature] = cookie.split(".");

    if (!token || !signature) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    // Verify signature
    const expectedSignature = crypto
      .createHmac("sha256", AUTH_SECRET)
      .update(token)
      .digest("hex");

    if (signature !== expectedSignature) {
      // Tampered cookie
      const response = NextResponse.json({ user: null }, { status: 200 });
      response.cookies.delete("dk_session");
      return response;
    }

    const payload = JSON.parse(Buffer.from(token, "base64").toString("utf-8"));

    // Check expiry
    if (payload.exp && payload.exp < Date.now()) {
      const response = NextResponse.json({ user: null }, { status: 200 });
      response.cookies.delete("dk_session");
      return response;
    }

    return NextResponse.json({
      user: {
        id: payload.id,
        email: payload.email,
        firstName: payload.firstName,
        lastName: payload.lastName,
      },
    });
  } catch {
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
