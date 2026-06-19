import { Link, useRouterState } from "@tanstack/react-router";
import { ShoppingBag, Phone, Lock } from "lucide-react";
import { useCart, CONTACT } from "@/lib/cart";

export function SiteHeader() {
  const { count } = useCart();
  const path = useRouterState({ select: (s) => s.location.pathname });

  const nav = [
    { to: "/", label: "Shop" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-primary text-primary-foreground font-black text-xl shadow-[var(--shadow-glow)]">S</span>
          <div className="leading-none">
            <div className="display text-2xl font-black tracking-wide">SAKSI</div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Poster Hub</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} className={`text-sm uppercase tracking-wider transition-colors ${path === n.to ? "text-primary" : "text-foreground/80 hover:text-primary"}`}>
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a href={`tel:${CONTACT.phone}`} className="hidden items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-medium hover:border-primary hover:text-primary md:flex">
            <Phone className="h-4 w-4" /> {CONTACT.phone}
          </a>
          <Link to="/admin" className="grid h-10 w-10 place-items-center rounded-md border border-border hover:border-primary hover:text-primary" aria-label="Admin">
            <Lock className="h-4 w-4" />
          </Link>
          <Link to="/cart" className="relative grid h-10 w-10 place-items-center rounded-md bg-primary text-primary-foreground hover:opacity-90">
            <ShoppingBag className="h-4 w-4" />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-[11px] font-bold text-accent-foreground">{count}</span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}