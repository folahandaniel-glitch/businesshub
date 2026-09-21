import { NextResponse } from 'next/server';
import { z } from 'zod';
import { toggleWishlist } from '@/lib/wishlist';

const schema = z.object({ productId: z.string().min(1) });

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Invalid product.' }, { status: 400 });

  try {
    const result = await toggleWishlist(parsed.data.productId);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Could not update wishlist.' }, { status: 401 });
  }
}
