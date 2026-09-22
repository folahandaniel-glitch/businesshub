import { prisma } from './prisma';
import { OrderStatus, StockStatus, ProductStatus } from '@prisma/client';

export type DashboardData = {
  totalSales: number;
  todaySales: number;
  monthSales: number;
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  totalCustomers: number;
  totalProducts: number;
  lowStockCount: number;
  outOfStockCount: number;
  recentOrders: { orderNumber: string; customerLabel: string; grandTotal: number; status: string; createdAt: Date }[];
  recentCustomers: { fullName: string; email: string; createdAt: Date }[];
  topProducts: { name: string; soldCount: number; price: number }[];
  revenueByDay: { date: string; revenue: number }[];
};

const EXCLUDED_FROM_SALES: OrderStatus[] = [OrderStatus.CANCELLED, OrderStatus.REFUNDED];

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function startOfMonth() {
  const d = new Date();
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d;
}

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Every read here is independent, so Promise.all is used throughout
 * rather than prisma.$transaction's array form - that form requires
 * every element to be a branded PrismaPromise, which is easy to violate
 * by accident and has caused real build failures earlier in this project.
 * Promise.all has no such constraint and needs no atomicity here anyway.
 */
export async function getDashboardData(): Promise<DashboardData> {
  const [
    salesAgg,
    todaySalesAgg,
    monthSalesAgg,
    totalOrders,
    pendingOrders,
    completedOrders,
    cancelledOrders,
    totalCustomers,
    totalProducts,
    lowStockCount,
    outOfStockCount,
    recentOrdersRaw,
    recentCustomersRaw,
    topProductsRaw,
    revenueOrdersRaw
  ] = await Promise.all([
    prisma.order.aggregate({ where: { status: { notIn: EXCLUDED_FROM_SALES } }, _sum: { grandTotal: true } }),
    prisma.order.aggregate({
      where: { status: { notIn: EXCLUDED_FROM_SALES }, createdAt: { gte: startOfToday() } },
      _sum: { grandTotal: true }
    }),
    prisma.order.aggregate({
      where: { status: { notIn: EXCLUDED_FROM_SALES }, createdAt: { gte: startOfMonth() } },
      _sum: { grandTotal: true }
    }),
    prisma.order.count(),
    prisma.order.count({ where: { status: OrderStatus.PENDING } }),
    prisma.order.count({ where: { status: OrderStatus.DELIVERED } }),
    prisma.order.count({ where: { status: OrderStatus.CANCELLED } }),
    prisma.customer.count(),
    prisma.product.count({ where: { status: ProductStatus.PUBLISHED } }),
    prisma.inventory.count({ where: { stockStatus: StockStatus.LOW_STOCK } }),
    prisma.inventory.count({ where: { stockStatus: StockStatus.OUT_OF_STOCK } }),
    prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        orderNumber: true,
        grandTotal: true,
        status: true,
        createdAt: true,
        guestName: true,
        customer: { select: { fullName: true } }
      }
    }),
    prisma.customer.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: { fullName: true, email: true, createdAt: true }
    }),
    prisma.product.findMany({
      where: { status: ProductStatus.PUBLISHED },
      orderBy: { soldCount: 'desc' },
      take: 5,
      select: { name: true, soldCount: true, price: true }
    }),
    prisma.order.findMany({
      where: { status: { notIn: EXCLUDED_FROM_SALES }, createdAt: { gte: daysAgo(29) } },
      select: { grandTotal: true, createdAt: true }
    })
  ]);

  const revenueMap = new Map<string, number>();
  for (let i = 29; i >= 0; i--) {
    const d = daysAgo(i);
    revenueMap.set(d.toISOString().slice(0, 10), 0);
  }
  for (const order of revenueOrdersRaw as { grandTotal: unknown; createdAt: Date }[]) {
    const key = order.createdAt.toISOString().slice(0, 10);
    revenueMap.set(key, (revenueMap.get(key) ?? 0) + Number(order.grandTotal));
  }

  return {
    totalSales: Number(salesAgg._sum.grandTotal ?? 0),
    todaySales: Number(todaySalesAgg._sum.grandTotal ?? 0),
    monthSales: Number(monthSalesAgg._sum.grandTotal ?? 0),
    totalOrders,
    pendingOrders,
    completedOrders,
    cancelledOrders,
    totalCustomers,
    totalProducts,
    lowStockCount,
    outOfStockCount,
    recentOrders: (
      recentOrdersRaw as {
        orderNumber: string;
        grandTotal: unknown;
        status: string;
        createdAt: Date;
        guestName: string | null;
        customer: { fullName: string } | null;
      }[]
    ).map((o) => ({
      orderNumber: o.orderNumber,
      customerLabel: o.customer?.fullName ?? o.guestName ?? 'Guest',
      grandTotal: Number(o.grandTotal),
      status: o.status,
      createdAt: o.createdAt
    })),
    recentCustomers: recentCustomersRaw,
    topProducts: (topProductsRaw as { name: string; soldCount: number; price: unknown }[]).map((p) => ({
      name: p.name,
      soldCount: p.soldCount,
      price: Number(p.price)
    })),
    revenueByDay: Array.from(revenueMap.entries()).map(([date, revenue]) => ({ date, revenue }))
  };
}
