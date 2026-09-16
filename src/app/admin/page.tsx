import type { Metadata } from 'next';
import { ShieldCheck } from 'lucide-react';
import { ComingSoon } from '@/components/ui/ComingSoon';

export const metadata: Metadata = { title: 'Admin', robots: { index: false, follow: false } };

export default function AdminPage() {
  return (
    <ComingSoon
      icon={<ShieldCheck size={26} />}
      title="Admin backend is being built"
      body="Product, order, inventory and Super Admin management arrive across the next few stages. Use the Prisma scripts in the project README to manage data until then."
      stage="Stage 5 onward"
    />
  );
}
