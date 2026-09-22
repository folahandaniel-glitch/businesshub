import type { Metadata } from 'next';
import { DollarSign, ShoppingBag, Clock, CheckCircle2, XCircle, Users, Package, AlertTriangle, PackageX } from 'lucide-react';
import { StatCard } from '@/components/admin/StatCard';
import { RevenueChart } from '@/components/admin/RevenueChart';
import { RecentOrders, RecentCustomers, TopProducts } from '@/components/admin/RecentActivity';
import { getDashboardData } from '@/lib/admin-dashboard';
import { formatNaira } from '@/lib/utils';

export const metadata: Metadata = { title: 'Admin dashboard', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const data = await getDashboardData();

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-ink">Dashboard</h1>
      <p className="mt-1 text-sm text-slate">An overview of sales, orders and stock right now.</p>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total sales" value={formatNaira(data.totalSales)} icon={<DollarSign size={17} />} />
        <StatCard label="Today's sales" value={formatNaira(data.todaySales)} icon={<DollarSign size={17} />} />
        <StatCard label="This month's sales" value={formatNaira(data.monthSales)} icon={<DollarSign size={17} />} />
        <StatCard label="Total orders" value={String(data.totalOrders)} icon={<ShoppingBag size={17} />} />
        <StatCard label="Pending orders" value={String(data.pendingOrders)} icon={<Clock size={17} />} tone="warning" />
        <StatCard label="Completed orders" value={String(data.completedOrders)} icon={<CheckCircle2 size={17} />} />
        <StatCard label="Cancelled orders" value={String(data.cancelledOrders)} icon={<XCircle size={17} />} tone="danger" />
        <StatCard label="Total customers" value={String(data.totalCustomers)} icon={<Users size={17} />} />
        <StatCard label="Total products" value={String(data.totalProducts)} icon={<Package size={17} />} />
        <StatCard label="Low stock" value={String(data.lowStockCount)} icon={<AlertTriangle size={17} />} tone="warning" />
        <StatCard label="Out of stock" value={String(data.outOfStockCount)} icon={<PackageX size={17} />} tone="danger" />
      </div>

      <div className="mt-6">
        <RevenueChart data={data.revenueByDay} />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentOrders orders={data.recentOrders} />
        </div>
        <RecentCustomers customers={data.recentCustomers} />
      </div>

      <div className="mt-5">
        <TopProducts products={data.topProducts} />
      </div>
    </div>
  );
}
