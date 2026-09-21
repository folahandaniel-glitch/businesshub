import { NextResponse } from 'next/server';
import { z } from 'zod';
import { placeOrder } from '@/lib/checkout';

const schema = z.object({
  guestName: z.string().min(2).max(120).optional(),
  guestEmail: z.string().email().max(160).optional(),
  guestPhone: z.string().min(7).max(30).optional(),
  deliveryState: z.string().min(2).max(60),
  deliveryCity: z.string().min(2).max(80),
  deliveryAddress: z.string().min(5).max(300),
  deliveryNote: z.string().max(300).optional(),
  paymentMethod: z.enum(['BANK_TRANSFER', 'PAY_ON_DELIVERY'])
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Check the checkout form for missing or invalid fields.' }, { status: 400 });
  }

  const result = await placeOrder(parsed.data);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });
  return NextResponse.json({ ok: true, orderNumber: result.orderNumber });
}
