import { getProductBySlug } from '@/lib/bigcommerce/api';
import { NextResponse } from 'next/server';

type RouteParams = {
  params: Promise<{ slug: string }>;
};

export async function GET(request: Request, context: RouteParams) {
  try {
    const { slug } = await context.params;
    const product = await getProductBySlug(slug);
    
    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}
