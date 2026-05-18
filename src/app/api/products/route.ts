import { getProducts } from '@/lib/bigcommerce/api';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const rawFirst = searchParams.get('first') ? parseInt(searchParams.get('first')!) : 10;
    // Cap to maximum of 50 to comply with BigCommerce Storefront GraphQL limits
    const first = Math.min(rawFirst, 50);
    const entityIds = searchParams.get('entityIds')
      ? searchParams.get('entityIds')!.split(',').map(id => parseInt(id))
      : undefined;

    const products = await getProducts({ first, entityIds });
    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
