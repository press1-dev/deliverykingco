import { getProductVariants } from '@/lib/bigcommerce/api';
import { NextResponse } from 'next/server';

type RouteParams = {
  params: Promise<{ slug: string }>;
};

export async function GET(request: Request, context: RouteParams) {
  try {
    const { slug } = await context.params;
    const variants = await getProductVariants(slug);

    return NextResponse.json({ success: true, data: variants });
  } catch (error) {
    console.error('Error fetching product variants:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product variants' },
      { status: 500 }
    );
  }
}
