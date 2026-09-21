import { NextResponse } from 'next/server';
import { z } from 'zod';
import { addToCart } from '@/lib/cart';

const schema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1).max(50).default(1)
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Could not add that item to your cart.' }, { status: 400 });
  }

  try {
    const cart = await addToCart(parsed.data.productId, parsed.data.quantity);
    return NextResponse.json(cart);
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Could not add to cart.' }, { status: 400 });
  }
}
