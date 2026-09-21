import { prisma } from './prisma';
import { getOrCreateGuestCartKey, getSession } from './session';

export type CartLineData = {
  id: string;
  productId: string;
  name: string;
  slug: string;
  brand: string;
  imageUrl: string | null;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
  stockQuantity: number;
  maxReached: boolean;
};

export type CartSummary = {
  lines: CartLineData[];
  subtotal: number;
  itemCount: number;
};

/** The cart for whoever is making this request: the signed-in customer, or the current guest cookie. */
async function resolveCart(createIfMissing: boolean) {
  const session = await getSession();

  if (session) {
    const existing = await prisma.cart.findFirst({ where: { customerId: session.customerId } });
    if (existing) return existing;
    if (!createIfMissing) return null;
    return prisma.cart.create({ data: { customerId: session.customerId } });
  }

  const guestKey = getOrCreateGuestCartKey();
  const existing = await prisma.cart.findUnique({ where: { sessionKey: guestKey } });
  if (existing) return existing;
  if (!createIfMissing) return null;
  return prisma.cart.create({ data: { sessionKey: guestKey } });
}

function toSummary(
  items: {
    id: string;
    productId: string;
    quantity: number;
    unitPrice: unknown;
    product: {
      name: string;
      slug: string;
      brand: string;
      images: { url: string }[];
      inventory: { stockQuantity: number } | null;
    };
  }[]
): CartSummary {
  const lines: CartLineData[] = items.map((item) => {
    const unitPrice = Number(item.unitPrice);
    const stockQuantity = item.product.inventory?.stockQuantity ?? 0;
    return {
      id: item.id,
      productId: item.productId,
      name: item.product.name,
      slug: item.product.slug,
      brand: item.product.brand,
      imageUrl: item.product.images[0]?.url ?? null,
      unitPrice,
      quantity: item.quantity,
      lineTotal: unitPrice * item.quantity,
      stockQuantity,
      maxReached: item.quantity >= stockQuantity
    };
  });

  return {
    lines,
    subtotal: lines.reduce((sum, l) => sum + l.lineTotal, 0),
    itemCount: lines.reduce((sum, l) => sum + l.quantity, 0)
  };
}

const itemInclude = {
  product: {
    select: {
      name: true,
      slug: true,
      brand: true,
      images: { where: { isPrimary: true }, take: 1, select: { url: true } },
      inventory: { select: { stockQuantity: true } }
    }
  }
} as const;

export async function getCart(): Promise<CartSummary> {
  try {
    const cart = await resolveCart(false);
    if (!cart) return { lines: [], subtotal: 0, itemCount: 0 };

    const items = await prisma.cartItem.findMany({
      where: { cartId: cart.id },
      include: itemInclude,
      orderBy: { createdAt: 'asc' }
    });
    return toSummary(items);
  } catch {
    return { lines: [], subtotal: 0, itemCount: 0 };
  }
}

export async function addToCart(productId: string, quantity: number) {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { price: true, inventory: { select: { stockQuantity: true } } }
  });
  if (!product) throw new Error('Product not found.');

  const available = product.inventory?.stockQuantity ?? 0;
  if (available <= 0) throw new Error('This product is out of stock.');

  const cart = await resolveCart(true);
  if (!cart) throw new Error('Could not open a cart.');

  const existing = await prisma.cartItem.findFirst({ where: { cartId: cart.id, productId, variantId: null } });
  const nextQuantity = Math.min(available, (existing?.quantity ?? 0) + quantity);

  if (existing) {
    await prisma.cartItem.update({ where: { id: existing.id }, data: { quantity: nextQuantity } });
  } else {
    await prisma.cartItem.create({
      data: { cartId: cart.id, productId, quantity: Math.min(available, quantity), unitPrice: product.price }
    });
  }

  return getCart();
}

export async function updateCartItem(itemId: string, quantity: number) {
  const cart = await resolveCart(false);
  if (!cart) throw new Error('Cart not found.');

  const item = await prisma.cartItem.findFirst({
    where: { id: itemId, cartId: cart.id },
    include: { product: { select: { inventory: { select: { stockQuantity: true } } } } }
  });
  if (!item) throw new Error('Item not found in your cart.');

  if (quantity <= 0) {
    await prisma.cartItem.delete({ where: { id: itemId } });
  } else {
    const available = item.product.inventory?.stockQuantity ?? 0;
    await prisma.cartItem.update({ where: { id: itemId }, data: { quantity: Math.min(quantity, Math.max(available, 1)) } });
  }

  return getCart();
}

export async function removeCartItem(itemId: string) {
  const cart = await resolveCart(false);
  if (!cart) throw new Error('Cart not found.');

  await prisma.cartItem.deleteMany({ where: { id: itemId, cartId: cart.id } });
  return getCart();
}

/** Called right after a successful login: folds the guest cart into the customer's own cart. */
export async function mergeGuestCartIntoCustomer(customerId: string, guestSessionKey: string) {
  const guestCart = await prisma.cart.findUnique({ where: { sessionKey: guestSessionKey }, include: { items: true } });
  if (!guestCart || guestCart.items.length === 0) return;

  let customerCart = await prisma.cart.findFirst({ where: { customerId } });
  if (!customerCart) {
    customerCart = await prisma.cart.create({ data: { customerId } });
  }

  for (const item of guestCart.items) {
    const existing = await prisma.cartItem.findFirst({
      where: { cartId: customerCart.id, productId: item.productId, variantId: item.variantId }
    });
    if (existing) {
      await prisma.cartItem.update({ where: { id: existing.id }, data: { quantity: existing.quantity + item.quantity } });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: customerCart.id,
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
          unitPrice: item.unitPrice
        }
      });
    }
  }

  await prisma.cart.delete({ where: { id: guestCart.id } });
}

/** Only what the header badge needs: a fast count with no line-item mapping. */
export async function getCartItemCount(): Promise<number> {
  try {
    const cart = await resolveCart(false);
    if (!cart) return 0;
    const items = await prisma.cartItem.findMany({ where: { cartId: cart.id }, select: { quantity: true } });
    return items.reduce((sum: number, i: (typeof items)[number]) => sum + i.quantity, 0);
  } catch {
    return 0;
  }
}

/** The current visitor's cart id, if one exists yet. Used by checkout to load lines for order creation. */
export async function getActiveCartId(): Promise<string | null> {
  const cart = await resolveCart(false);
  return cart?.id ?? null;
}

/** Removes every line from a cart once its contents have become a real order. */
export async function clearCart(cartId: string) {
  await prisma.cartItem.deleteMany({ where: { cartId } });
}
