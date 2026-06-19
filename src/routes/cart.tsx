import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/cart")({ component: CartPage });

function CartPage() {
  const { items, setQty, remove, total, count } = useCart();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-8">
        <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Step 1 of 2</div>
        <h1 className="display mt-1 text-4xl font-black md:text-5xl">YOUR CART</h1>

        {items.length === 0 ? (
          <div className="mt-16 grid place-items-center rounded-xl border border-dashed border-border p-12 text-center">
            <ShoppingBag className="h-10 w-10 text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">Your cart is empty.</p>
            <Link to="/" className="mt-4 inline-flex rounded-md bg-primary px-5 py-2 text-sm font-bold uppercase tracking-wider text-primary-foreground hover:opacity-90">Browse Posters</Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
            <div className="space-y-4">
              {items.map(({ poster, qty }) => (
                <div key={poster.id} className="flex gap-4 rounded-xl border border-border bg-card p-4">
                  <img src={poster.image_url} alt={poster.title} className="h-28 w-20 rounded-md object-cover" />
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <div className="font-semibold">{poster.title}</div>
                      <div className="text-xs uppercase text-muted-foreground">{poster.category}</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 rounded-md border border-border">
                        <button onClick={() => setQty(poster.id, qty - 1)} className="grid h-8 w-8 place-items-center hover:text-primary"><Minus className="h-3 w-3" /></button>
                        <span className="w-8 text-center text-sm font-semibold">{qty}</span>
                        <button onClick={() => setQty(poster.id, qty + 1)} className="grid h-8 w-8 place-items-center hover:text-primary"><Plus className="h-3 w-3" /></button>
                      </div>
                      <div className="display text-lg font-black text-primary">LKR {poster.price * qty}</div>
                    </div>
                  </div>
                  <button onClick={() => remove(poster.id)} className="self-start text-muted-foreground hover:text-destructive" aria-label="Remove"><Trash2 className="h-4 w-4" /></button>
                </div>
              ))}
            </div>

            <aside className="h-fit rounded-xl border border-border bg-card p-6">
              <div className="display text-2xl font-black">ORDER SUMMARY</div>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Frames</span><span>{count}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>LKR {total}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>Calculated at checkout</span></div>
              </div>
              <div className="my-4 h-px bg-border" />
              <div className="flex justify-between text-lg font-bold"><span>Total</span><span className="text-primary">LKR {total}</span></div>
              <Link to="/checkout" className="mt-6 flex w-full items-center justify-center rounded-md bg-primary py-3 text-sm font-bold uppercase tracking-wider text-primary-foreground hover:opacity-90">Proceed to Checkout</Link>
              <Link to="/" className="mt-2 block text-center text-xs uppercase tracking-wider text-muted-foreground hover:text-primary">Continue shopping</Link>
            </aside>
          </div>
        )}
      </div>
      <SiteFooter />
    </div>
  );
}
