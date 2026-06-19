import { createFileRoute } from "@tanstack/react-router";
import { Phone, Mail, MessageCircle } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { CONTACT } from "@/lib/cart";

export const Route = createFileRoute("/contact")({ component: Contact });

function Contact() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <div className="mx-auto max-w-4xl px-4 py-16 md:px-8">
        <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Get in touch</div>
        <h1 className="display mt-1 text-4xl font-black md:text-6xl">CONTACT US</h1>
        <p className="mt-3 max-w-xl text-muted-foreground">For custom poster orders, bulk pricing, or order updates — reach us anytime.</p>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <a href={`tel:${CONTACT.phone}`} className="group rounded-xl border border-border bg-card p-6 hover:border-primary">
            <Phone className="h-7 w-7 text-primary" />
            <div className="mt-4 text-xs uppercase tracking-wider text-muted-foreground">Call</div>
            <div className="mt-1 text-lg font-semibold group-hover:text-primary">{CONTACT.phone}</div>
          </a>
          <a href={`https://wa.me/${CONTACT.phoneIntl}`} target="_blank" rel="noreferrer" className="group rounded-xl border border-border bg-card p-6 hover:border-primary">
            <MessageCircle className="h-7 w-7 text-primary" />
            <div className="mt-4 text-xs uppercase tracking-wider text-muted-foreground">WhatsApp</div>
            <div className="mt-1 text-lg font-semibold group-hover:text-primary">{CONTACT.phone}</div>
          </a>
          <a href={`mailto:${CONTACT.email}`} className="group rounded-xl border border-border bg-card p-6 hover:border-primary">
            <Mail className="h-7 w-7 text-primary" />
            <div className="mt-4 text-xs uppercase tracking-wider text-muted-foreground">Email</div>
            <div className="mt-1 break-all text-sm font-semibold group-hover:text-primary">{CONTACT.email}</div>
          </a>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
