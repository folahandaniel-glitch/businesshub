import { NextResponse } from 'next/server';
import { logoutCustomer } from '@/lib/customer-auth';

export async function POST() {
  logoutCustomer();
  return NextResponse.json({ ok: true });
}
