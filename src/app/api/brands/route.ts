import { getBrands } from '@/lib/bigcommerce/api';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const brands = await getBrands();
    return NextResponse.json({ success: true, data: brands });
  } catch (error) {
    console.error('Error fetching brands:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch brands' },
      { status: 500 }
    );
  }
}
