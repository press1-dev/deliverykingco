import { getCart, createCart } from '@/lib/bigcommerce/api';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const cartEntityId = request.nextUrl.searchParams.get('cartEntityId');

    if (!cartEntityId) {
      return NextResponse.json(
        { success: false, error: 'cartEntityId query parameter is required' },
        { status: 400 }
      );
    }

    const cart = await getCart(cartEntityId);

    if (!cart) {
      return NextResponse.json(
        { success: false, error: 'Cart not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: cart });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch cart' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { lineItems } = body;

    if (!lineItems || !Array.isArray(lineItems)) {
      return NextResponse.json(
        { success: false, error: 'lineItems array is required' },
        { status: 400 }
      );
    }

    const cart = await createCart(lineItems);

    if (!cart) {
      return NextResponse.json(
        { success: false, error: 'Failed to create cart' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: cart });
  } catch (error) {
    console.error('Error creating cart:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create cart' },
      { status: 500 }
    );
  }
}
