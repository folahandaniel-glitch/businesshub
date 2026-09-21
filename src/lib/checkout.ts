import { prisma } from './prisma';
import { getSession } from './session';
import { getActiveCartId, clearCart } from './cart';
import { generateOrderNumber } from './utils';
import { estimateDeliveryFee } from './delivery';
import { PaymentMethod, InventoryAction } from '@prisma/client';

export type CheckoutInput = {
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
  deliveryState: string;
  deliveryCity: string;
  deliveryAddress: string;
  deliveryNote?: string;
  paymentMethod: 'BANK_TRANSFER' | 'PAY_ON_DELIVERY';
};

export type CheckoutResult =
  | { ok: true; orderNumber: string }
  | { ok: false; error: string };

export async function placeOrder(input: CheckoutInput): Promise<CheckoutResult> {
  const session = await getSession();

  if (!session && (!input.guestName || !input.guestEmail || !input.guestPhone)) {
    return { ok: false, error: 'Enter your name, email and phone number to check out as a guest.' };
  }
  if (!input.deliveryState || !input.deliveryCity || !input.deliveryAddress) {
    return { ok: false, error: 'Enter a complete delivery address.' };
  }

  const cartId = await getActiveCartId();
  if (!cartId) return { ok: false, error: 'Your cart is empty.' };

  try {
    const orderNumber = await prisma.$transaction(async (tx) => {
      const items = await tx.cartItem.findMany({
        where: { cartId },
        include: {
          product: {
            select: { id: true, name: true, sku: true, price: true, inventory: true }
          }
        }
      });

      if (items.length === 0) throw new Error('Your cart is empty.');

      for (const item of items) {
        const stock = item.product.inventory?.stockQuantity ?? 0;
        if (item.quantity > stock) {
          throw new Error(`${item.product.name} only has ${stock} left in stock. Update the quantity in your cart.`);
        }
      }

      const subtotal = items.reduce((sum: number, item: (typeof items)[number]) => sum + Number(item.unitPrice) * item.quantity, 0);
      const deliveryFee = estimateDeliveryFee(input.deliveryState);
      const grandTotal = subtotal + deliveryFee;
      const number = generateOrderNumber();

      const order = await tx.order.create({
        data: {
          orderNumber: number,
          customerId: session?.customerId ?? null,
          guestName: session ? null : input.guestName,
          guestEmail: session ? null : input.guestEmail,
          guestPhone: session ? null : input.guestPhone,
          deliveryState: input.deliveryState,
          deliveryCity: input.deliveryCity,
          deliveryAddress: input.deliveryAddress,
          deliveryNote: input.deliveryNote || null,
          subtotal,
          discountTotal: 0,
          deliveryFee,
          grandTotal,
          items: {
            create: items.map((item: (typeof items)[number]) => ({
              productId: item.product.id,
              productName: item.product.name,
              productSku: item.product.sku,
              unitPrice: item.unitPrice,
              quantity: item.quantity,
              lineTotal: Number(item.unitPrice) * item.quantity
            }))
          },
          payments: {
            create: {
              provider: input.paymentMethod as PaymentMethod,
              reference: `${number}-P1`,
              amount: grandTotal,
              status: 'PENDING'
            }
          }
        }
      });

      for (const item of items) {
        if (!item.product.inventory) continue;
        const newQuantity = item.product.inventory.stockQuantity - item.quantity;

        await tx.inventory.update({
          where: { productId: item.product.id },
          data: { stockQuantity: newQuantity, totalSold: { increment: item.quantity } }
        });
        await tx.inventoryTransaction.create({
          data: {
            inventoryId: item.product.inventory.id,
            action: InventoryAction.SALE,
            quantity: -item.quantity,
            balanceAfter: newQuantity,
            reference: order.orderNumber
          }
        });
        await tx.product.update({ where: { id: item.product.id }, data: { soldCount: { increment: item.quantity } } });
      }

      return order.orderNumber;
    });

    await clearCart(cartId);
    return { ok: true, orderNumber };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Could not place your order. Try again.' };
  }
}
