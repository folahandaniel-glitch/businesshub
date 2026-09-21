import { prisma } from './prisma';
import { getSession } from './session';

export type OrderSummary = {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  grandTotal: number;
  createdAt: Date;
  itemCount: number;
};

export type OrderDetail = OrderSummary & {
  subtotal: number;
  discountTotal: number;
  deliveryFee: number;
  deliveryState: string;
  deliveryCity: string;
  deliveryAddress: string;
  deliveryNote: string | null;
  guestName: string | null;
  guestEmail: string | null;
  paymentMethod: string | null;
  items: { productName: string; productSku: string; unitPrice: number; quantity: number; lineTotal: number }[];
};

export async function getCustomerOrders(): Promise<OrderSummary[]> {
  try {
    const session = await getSession();
    if (!session) return [];

    const orders = await prisma.order.findMany({
      where: { customerId: session.customerId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        orderNumber: true,
        status: true,
        paymentStatus: true,
        grandTotal: true,
        createdAt: true,
        items: { select: { quantity: true } }
      }
    });

    return orders.map((o: (typeof orders)[number]) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      status: o.status,
      paymentStatus: o.paymentStatus,
      grandTotal: Number(o.grandTotal),
      createdAt: o.createdAt,
      itemCount: o.items.reduce((sum: number, i: (typeof o.items)[number]) => sum + i.quantity, 0)
    }));
  } catch {
    return [];
  }
}

/**
 * Looked up by order number rather than id, since that is what a customer
 * has in hand from the confirmation screen. A signed-in customer can only
 * open their own orders; an order placed as a guest can be opened by
 * number alone, matching how a guest would track a delivery by reference.
 */
export async function getOrderByNumber(orderNumber: string): Promise<OrderDetail | null> {
  try {
    const session = await getSession();

    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: {
        items: { select: { productName: true, productSku: true, unitPrice: true, quantity: true, lineTotal: true } },
        payments: { select: { provider: true }, take: 1, orderBy: { createdAt: 'desc' } }
      }
    });
    if (!order) return null;
    if (order.customerId && order.customerId !== session?.customerId) return null;

    return {
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      paymentStatus: order.paymentStatus,
      grandTotal: Number(order.grandTotal),
      subtotal: Number(order.subtotal),
      discountTotal: Number(order.discountTotal),
      deliveryFee: Number(order.deliveryFee),
      deliveryState: order.deliveryState,
      deliveryCity: order.deliveryCity,
      deliveryAddress: order.deliveryAddress,
      deliveryNote: order.deliveryNote,
      guestName: order.guestName,
      guestEmail: order.guestEmail,
      paymentMethod: order.payments[0]?.provider ?? null,
      createdAt: order.createdAt,
      itemCount: order.items.reduce((sum: number, i: (typeof order.items)[number]) => sum + i.quantity, 0),
      items: order.items.map((i: (typeof order.items)[number]) => ({
        productName: i.productName,
        productSku: i.productSku,
        unitPrice: Number(i.unitPrice),
        quantity: i.quantity,
        lineTotal: Number(i.lineTotal)
      }))
    };
  } catch {
    return null;
  }
}

export async function getCurrentCustomer() {
  try {
    const session = await getSession();
    if (!session) return null;
    return prisma.customer.findUnique({
      where: { id: session.customerId },
      select: { id: true, fullName: true, email: true, phone: true, createdAt: true }
    });
  } catch {
    return null;
  }
}
