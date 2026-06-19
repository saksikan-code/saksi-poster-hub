import { Phone, Mail, MessageCircle } from "lucide-react";
import { CONTACT } from "@/lib/cart";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-card/40">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-3 md:px-8">
        <div>
          <div className="display text-3xl font-black">SAKSI POSTER HUB GOD MODE BEGINS   </div>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">Premium cinematic, devotional, automotive & minimal posters — handpicked & framed for அன்பான fans.</p>
        </div>
        <div>
          <div className="mb-3 text-xs uppercase tracking-[0.3em] text-muted-foreground">Contact</div>
          <ul className="space-y-2 text-sm">
            <li><a className="flex items-center gap-2 hover:text-primary" href={`tel:${CONTACT.phone}`}><Phone className="h-4 w-4" />{CONTACT.phone}</a></li>
            <li><a className="flex items-center gap-2 hover:text-primary" href={`https://wa.me/${CONTACT.phoneIntl}`} target="_blank" rel="noreferrer"><MessageCircle className="h-4 w-4" />WhatsApp {CONTACT.phone}</a></li>
            <li><a className="flex items-center gap-2 hover:text-primary" href={`mailto:${CONTACT.email}`}><Mail className="h-4 w-4" />{CONTACT.email}</a></li>
          </ul>
        </div>
        <div>
          <div className="mb-3 text-xs uppercase tracking-[0.3em] text-muted-foreground">Order Info</div>
          <p className="text-sm text-muted-foreground">Island-wide delivery. Cash on delivery available. Order updates sent via WhatsApp.</p>
        </div>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">© {new Date().getFullYear()} Saksi Poster Hub. All rights reserved.</div>
    </footer>
  );
}
