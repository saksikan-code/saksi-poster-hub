import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { useCart, buildWhatsAppMessage, whatsappLink, CONTACT } from "@/lib/cart";
import { MessageCircle } from "lucide-react";

export const Route = createFileRoute("/checkout")({ component: Checkout });

function Checkout() {
  const { items, total, count, clear } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", phone: "", address: "", city: "", notes: "" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.address) return;
    const orderId = "SP" + Date.now().toString().slice(-6);
    const customer = { name: form.name, phone: form.phone, address: `${form.address}, ${form.city}${form.notes ? " — " + form.notes : ""}` };
    const msg = buildWhatsAppMessage(items, total, customer);
    // Open WhatsApp with prefilled order
    window.open(whatsappLink(msg), "_blank");
    // Save snapshot for confirmation page
    sessionStorage.setItem("saksi.lastOrder", JSON.stringify({ orderId, items, total, count, customer }));
    clear();
    navigate({ to: "/order-confirmed", search: { id: orderId } as any });
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <SiteHeader />
        <div className="mx-auto max-w-3xl px-4 py-20 text-center">
          <h1 className="display text-4xl font-black">Your cart is empty</h1>
          <Link to="/" className="mt-6 inline-flex rounded-md bg-primary px-5 py-2 text-sm font-bold uppercase tracking-wider text-primary-foreground">Browse Posters</Link>
        </div>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-8">
        <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Step 2 of 2</div>
        <h1 className="display mt-1 text-4xl font-black md:text-5xl">CHECKOUT</h1>

        <form onSubmit={submit} className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-5 rounded-xl border border-border bg-card p-6">
            <div className="display text-xl font-black">SHIPPING DETAILS</div>
            <Field label="Full Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
            <Field label="Mobile Number" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} required type="tel" />
            <Field label="Address" value={form.address} onChange={(v) => setForm({ ...form, address: v })} required />
            <Field label="City" value={form.city} onChange={(v) => setForm({ ...form, city: v })} required />
            <Field label="Order Notes (optional)" value={form.notes} onChange={(v) => setForm({ ...form, notes: v })} />
            <p className="text-xs text-muted-foreground">By placing the order, your details and item list will be sent to Saksi Poster Hub via WhatsApp ({CONTACT.phone}) for confirmation.</p>
          </div>

          <aside className="h-fit rounded-xl border border-border bg-card p-6">
            <div className="display text-xl font-black">ORDER REVIEW</div>
            <div className="mt-4 max-h-72 space-y-3 overflow-auto pr-2">
              {items.map(({ poster, qty }) => (
                <div key={poster.id} className="flex gap-3">
                  <img src={poster.image_url} alt="" className="h-14 w-10 rounded object-cover" />
                  <div className="flex-1 text-sm">
                    <div className="font-medium leading-tight">{poster.title}</div>
                    <div className="text-xs text-muted-foreground">Qty {qty} · LKR {poster.price}</div>
                  </div>
                  <div className="text-sm font-semibold">LKR {poster.price * qty}</div>
                </div>
              ))}
            </div>
            <div className="my-4 h-px bg-border" />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Total Frames</span><span>{count}</span></div>
              <div className="flex justify-between text-lg font-bold"><span>Total</span><span className="text-primary">LKR {total}</span></div>
            </div>
            <button type="submit" className="mt-5 flex w-full items-center justify-center gap-2 rounded-md bg-primary py-3 text-sm font-bold uppercase tracking-wider text-primary-foreground hover:opacity-90">
              <MessageCircle className="h-4 w-4" /> Place Order via WhatsApp
            </button>
          </aside>
        </form>
      </div>
      <SiteFooter />
    </div>
  );
}

function Field({ label, value, onChange, type = "text", required }: { label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs uppercase tracking-wider text-muted-foreground">{label}{required && " *"}</span>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} required={required} className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary" />
    </label>
  );
}
