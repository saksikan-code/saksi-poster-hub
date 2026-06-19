import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import type { Poster } from "./posters";

export type CartItem = { poster: Poster; qty: number };

type CartCtx = {
  items: CartItem[];
  add: (p: Poster) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  total: number;
  count: number;
};

const Ctx = createContext<CartCtx | null>(null);
const KEY = "saksi.cart.v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(items));
  }, [items]);

  const add = useCallback((p: Poster) => {
    setItems((cur) => {
      const existing = cur.find((i) => i.poster.id === p.id);
      if (existing) return cur.map((i) => (i.poster.id === p.id ? { ...i, qty: i.qty + 1 } : i));
      return [...cur, { poster: p, qty: 1 }];
    });
  }, []);

  const remove = useCallback((id: string) => setItems((c) => c.filter((i) => i.poster.id !== id)), []);
  const setQty = useCallback((id: string, qty: number) => {
    setItems((c) => c.map((i) => (i.poster.id === id ? { ...i, qty: Math.max(1, qty) } : i)));
  }, []);
  const clear = useCallback(() => setItems([]), []);

  const total = items.reduce((s, i) => s + i.poster.price * i.qty, 0);
  const count = items.reduce((s, i) => s + i.qty, 0);

  return <Ctx.Provider value={{ items, add, remove, setQty, clear, total, count }}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used within CartProvider");
  return c;
}

export const CONTACT = {
  phone: "0775712643",
  phoneIntl: "94775712643",
  email: "saksisaksikan221@gmail.com",
};

export function buildWhatsAppMessage(items: CartItem[], total: number, customer?: { name: string; address: string; phone: string }) {
  const lines = [
    "🎬 *New Order — Saksi Poster Hub*",
    "",
    "*Items:*",
    ...items.map((i, idx) => `${idx + 1}. ${i.poster.title} — Qty: ${i.qty} × LKR ${i.poster.price} = LKR ${i.poster.price * i.qty}`),
    "",
    `*Total Frames:* ${items.reduce((s, i) => s + i.qty, 0)}`,
    `*Grand Total:* LKR ${total}`,
  ];
  if (customer) {
    lines.push("", "*Shipping Details:*", `Name: ${customer.name}`, `Phone: ${customer.phone}`, `Address: ${customer.address}`);
  }
  return encodeURIComponent(lines.join("\n"));
}

export function whatsappLink(message: string) {
  return `https://wa.me/${CONTACT.phoneIntl}?text=${message}`;
}