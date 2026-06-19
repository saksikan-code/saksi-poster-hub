import { Plus } from "lucide-react";
import type { Poster } from "@/lib/posters";
import { useCart } from "@/lib/cart";
import { toast } from "sonner";

export function PosterCard({ poster }: { poster: Poster }) {
  const { add } = useCart();
  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-primary/60 hover:-translate-y-1 hover:shadow-[var(--shadow-poster)]">
      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
        <img src={poster.image_url} alt={poster.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
        {poster.tag && (
          <span className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">{poster.tag}</span>
        )}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background via-background/60 to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={() => { add(poster); toast.success(`${poster.title} added to cart`); }}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-primary py-2.5 text-sm font-bold uppercase tracking-wider text-primary-foreground hover:opacity-90"
          >
            <Plus className="h-4 w-4" /> Add to Cart
          </button>
        </div>
      </div>
      <div className="flex items-center justify-between p-4">
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold">{poster.title}</div>
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{poster.category}</div>
        </div>
        <div className="display text-xl font-black text-primary">LKR {poster.price}</div>
      </div>
    </div>
  );
}