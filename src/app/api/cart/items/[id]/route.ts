import { NextResponse } from 'next/server';
import { z } from 'zod';
import { updateCartItem, removeCartItem } from '@/lib/cart';

const schema = z.object({ quantity: z.number().int().min(0).max(50) });

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Invalid quantity.' }, { status: 400 });

  try {
    const cart = await updateCartItem(params.id, parsed.data.quantity);
    return NextResponse.json(cart);
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Could not update item.' }, { status: 400 });
  }
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  try {
    const cart = await removeCartItem(params.id);
    return NextResponse.json(cart);
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Could not remove item.' }, { status: 400 });
  }
}
