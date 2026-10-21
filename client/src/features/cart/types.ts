import type { Product } from '../catalog';
export type CartItem = Product & { quantity: number };
