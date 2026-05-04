import { addCartItems } from '@/lib/bigcommerce/api';
import { NextRequest, NextResponse } from 'next/server';

// Note: BigCommerce Storefront GraphQL API does not support deleteCartLineItem or updateCartLineItem mutations.
// Use the REST Storefront API for these operations instead.

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cartEntityId, lineItems } = body;

    if (!cartEntityId) {
      return NextResponse.json(
        { success: false, error: 'cartEntityId is required' },
        { status: 400 }
      );
    }

    if (!lineItems || !Array.isArray(lineItems)) {
      return NextResponse.json(
        { success: false, error: 'lineItems array is required' },
        { status: 400 }
      );
    }

    const cart = await addCartItems(cartEntityId, lineItems);

    if (!cart) {
      return NextResponse.json(
        { success: false, error: 'Failed to add items to cart' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: cart });
  } catch (error) {
    console.error('Error adding cart items:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add items to cart' },
      { status: 500 }
    );
  }
}

// DELETE and PATCH operations are not supported by BigCommerce Storefront GraphQL API
// Use REST Storefront API instead:
// DELETE /api/storefront/carts/{cartId}/items/{itemId}
