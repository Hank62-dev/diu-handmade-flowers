import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Product } from '../../shared/api/client';
import type { CartItem } from '../../features/cart';

type CartContextValue = { items: CartItem[]; selectedIds: string[]; selectedItems: CartItem[]; count: number; total: number; selectedTotal: number; add: (product: Product) => void; update: (id: string, quantity: number) => void; toggleSelected: (id: string) => void; selectAll: () => void; clearSelected: () => void; clear: () => void };
const CartContext = createContext<CartContextValue | null>(null);
const CART_KEY = 'diu_cart_session';
const readCart = (): { items: CartItem[]; selectedIds: string[] } => {
  try { const raw = sessionStorage.getItem(CART_KEY); return raw ? JSON.parse(raw) : { items: [], selectedIds: [] }; } catch { return { items: [], selectedIds: [] }; }
};

export function CartProvider({ children }: { children: ReactNode }) {
  const saved = readCart();
  const [items, setItems] = useState<CartItem[]>(saved.items);
  const [selectedIds, setSelectedIds] = useState<string[]>(saved.selectedIds);
  useEffect(() => { sessionStorage.setItem(CART_KEY, JSON.stringify({ items, selectedIds })); }, [items, selectedIds]);
  const value = useMemo(() => {
    const selectedItems = items.filter((item) => selectedIds.includes(item._id));
    return {
      items, selectedIds, selectedItems, count: items.reduce((sum, item) => sum + item.quantity, 0), total: items.reduce((sum, item) => sum + item.price * item.quantity, 0), selectedTotal: selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
      add: (product: Product) => { setSelectedIds((ids) => ids.includes(product._id) ? ids : [...ids, product._id]); setItems((current) => { const found = current.find((item) => item._id === product._id); return found ? current.map((item) => item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item) : [...current, { ...product, quantity: 1 }]; }); },
      update: (id: string, quantity: number) => { if (quantity < 1) setSelectedIds((ids) => ids.filter((selectedId) => selectedId !== id)); setItems((current) => quantity < 1 ? current.filter((item) => item._id !== id) : current.map((item) => item._id === id ? { ...item, quantity } : item)); },
      toggleSelected: (id: string) => setSelectedIds((ids) => ids.includes(id) ? ids.filter((selectedId) => selectedId !== id) : [...ids, id]),
      selectAll: () => setSelectedIds(items.map((item) => item._id)),
      clearSelected: () => { setItems((current) => current.filter((item) => !selectedIds.includes(item._id))); setSelectedIds([]); },
      clear: () => { setItems([]); setSelectedIds([]); },
    };
  }, [items, selectedIds]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
export function useCart() { const value = useContext(CartContext); if (!value) throw new Error('useCart must be used inside CartProvider'); return value; }
