import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Truck, MessageCircle, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { CONTACT } from "@/lib/cart";

export const Route = createFileRoute("/order-confirmed")({ component: Confirmed });

function Confirmed() {
  const [order, setOrder] = useState<any>(null);
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("saksi.lastOrder");
      if (raw) setOrder(JSON.parse(raw));
    } catch {}
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <div className="mx-auto max-w-3xl px-4 py-16 md:px-8">
        <div className="rounded-2xl border border-primary/40 bg-card p-8 text-center shadow-[var(--shadow-glow)]">
          <CheckCircle2 className="mx-auto h-14 w-14 text-primary" />
          <h1 className="display mt-4 text-4xl font-black md:text-5xl">ORDER PLACED!</h1>
          <p className="mt-2 text-lg text-primary">Your order delivery on the way 🚚</p>
          {order?.orderId && <p className="mt-1 text-sm text-muted-foreground">Order ID: <span className="font-mono">{order.orderId}</span></p>}

          <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm text-foreground">
            <Truck className="h-4 w-4 text-primary" /> Dispatch within 24 hours
          </div>
        </div>

        {order && (
          <div className="mt-8 rounded-xl border border-border bg-card p-6">
            <div className="display text-xl font-black">ORDER SUMMARY</div>
            <div className="mt-4 space-y-3">
              {order.items.map((i: any) => (
                <div key={i.poster.id} className="flex justify-between text-sm">
                  <span>{i.poster.title} × {i.qty}</span>
                  <span className="font-semibold">LKR {i.poster.price * i.qty}</span>
                </div>
              ))}
            </div>
            <div className="my-4 h-px bg-border" />
            <div className="flex justify-between text-lg font-bold"><span>Total</span><span className="text-primary">LKR {order.total}</span></div>
            {order.customer && (
              <div className="mt-4 rounded-md bg-background/50 p-4 text-sm">
                <div className="text-xs uppercase tracking-wider text-muted-foreground">Ship to</div>
                <div className="mt-1 font-medium">{order.customer.name}</div>
                <div className="text-muted-foreground">{order.customer.phone}</div>
                <div className="text-muted-foreground">{order.customer.address}</div>
              </div>
            )}
          </div>
        )}

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <a href={`https://wa.me/${CONTACT.phoneIntl}`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 rounded-md bg-primary py-3 text-sm font-bold uppercase tracking-wider text-primary-foreground hover:opacity-90">
            <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
          </a>
          <a href={`tel:${CONTACT.phone}`} className="flex items-center justify-center gap-2 rounded-md border border-border py-3 text-sm font-bold uppercase tracking-wider hover:border-primary hover:text-primary">
            <Phone className="h-4 w-4" /> Call {CONTACT.phone}
          </a>
        </div>

        <div className="mt-6 text-center">
          <Link to="/" className="text-xs uppercase tracking-wider text-muted-foreground hover:text-primary">← Back to shop</Link>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
