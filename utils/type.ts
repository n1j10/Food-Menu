import { Prisma } from '@/lib/generated/prisma/client';

export type actionFunction = (prevState: any,formData: FormData) => Promise<{ message: string }>;

export type CartItemWithProduct = Prisma.CartItemGetPayload<{include: { product: true };}>;



export type {
  Product,
  Cart,
  CartItem,
  Review,
  Favorite,
} from '@/lib/generated/prisma/client';
