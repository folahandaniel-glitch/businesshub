import type { Metadata } from 'next';
import { UserCircle } from 'lucide-react';
import { ComingSoon } from '@/components/ui/ComingSoon';

export const metadata: Metadata = { title: 'My account' };

export default function AccountPage() {
  return (
    <ComingSoon
      icon={<UserCircle size={26} />}
      title="Customer accounts are being built"
      body="Registration, sign in, saved addresses and order history are coming in the next stage."
      stage="Stage 4"
    />
  );
}
