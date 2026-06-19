import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Sparkles, Truck, ShieldCheck, Search } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { PosterCard } from "@/components/PosterCard";
import { fetchPosters, type Poster } from "@/lib/posters";
import { supabase } from "@/lib/supabase";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/")({ component: Index });

function Index() {
  const [posters, setPosters] = useState<Poster[]>([]);
  const [loading, setLoading] = useState(true);
  const [cat, setCat] = useState<string>("All");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"newest" | "price-low" | "price-high">("newest");

  useEffect(() => {
    load();
    const channel = supabase
      .channel("posters-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "posters" },
        () => { load(); },
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  async function load() {
    const data = await fetchPosters();
    setPosters(data);
    setLoading(false);
  }

  const cats = useMemo(() => ["All", ...Array.from(new Set(posters.map((p) => p.category)))], [posters]);

  const filtered = useMemo(() => {
    let result = cat === "All" ? posters : posters.filter((p) => p.category === cat);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((p) => p.title.toLowerCase().includes(q));
    }
    switch (sort) {
      case "price-low": result = [...result].sort((a, b) => a.price - b.price); break;
      case "price-high": result = [...result].sort((a, b) => b.price - a.price); break;
      default: result = [...result].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()); break;
    }
    return result;
  }, [posters, cat, search, sort]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <SiteHeader />
        <div className="mx-auto max-w-7xl px-4 py-20 md:px-8">
          <div className="mb-12 grid place-items-center gap-6 text-center">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-6 w-96" />
          </div>
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-[3/4] w-full rounded-xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        </div>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border" style={{ backgroundImage: "var(--gradient-hero)" }}>
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-20 md:grid-cols-2 md:px-8 md:py-28">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs uppercase tracking-[0.25em] text-primary">
              <Sparkles className="h-3 w-3" /> New  Bangers drops every week
                <Sparkles className="h-3 w-3" /> GOD MODE BEGINS
            </div>
            <h1 className="display text-5xl font-black leading-[0.95] md:text-7xl">
              POSTERS THAT <span className="text-primary">HIT HARDER</span> THAN THE MOVIE.
            </h1>
            <p className="mt-5 max-w-lg text-base text-muted-foreground md:text-lg">
              Cinematic. Devotional. Automotive. Minimal. Premium framed prints curated for அன்பான fans — delivered island-wide.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#shop" className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-bold uppercase tracking-wider text-primary-foreground hover:opacity-90">
                Shop Now <ArrowRight className="h-4 w-4" />
              </a>
              <Link to="/contact" className="inline-flex items-center gap-2 rounded-md border border-border px-6 py-3 text-sm font-bold uppercase tracking-wider hover:border-primary hover:text-primary">
                Custom Order
              </Link>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-4 text-center">
              <div><div className="display text-3xl text-primary">500+</div><div className="text-xs uppercase text-muted-foreground">Designs</div></div>
              <div><div className="display text-3xl text-primary">4.9★</div><div className="text-xs uppercase text-muted-foreground">Rated</div></div>
              <div><div className="display text-3xl text-primary">24h</div><div className="text-xs uppercase text-muted-foreground">Dispatch</div></div>
            </div>
          </div>

          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              {posters.slice(0, 4).map((p, i) => (
                <div key={p.id} className={`overflow-hidden rounded-xl border border-border shadow-[var(--shadow-poster)] ${i % 2 ? "translate-y-8" : ""}`}>
                  <img src={p.image_url} alt={p.title} className="aspect-[3/4] w-full object-cover" />
                </div>
              ))}
            </div>
            <div className="pointer-events-none absolute -inset-10 -z-10 rounded-full bg-primary/20 blur-3xl" />
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-b border-border bg-card/40">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 md:grid-cols-3 md:px-8">
          {[
            { icon: Truck, t: "Island-wide Delivery", s: "Dispatched within 24 hours" },
            { icon: ShieldCheck, t: "Premium Print Quality", s: "300 GSM matte / glossy" },
            { icon: Sparkles, t: "Order via WhatsApp", s: "Live updates till delivery" },
          ].map(({ icon: I, t, s }) => (
            <div key={t} className="flex items-center gap-3">
              <I className="h-6 w-6 text-primary" />
              <div>
                <div className="text-sm font-semibold">{t}</div>
                <div className="text-xs text-muted-foreground">{s}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Shop */}
      <section id="shop" className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">The Collection</div>
            <h2 className="display mt-1 text-4xl font-black md:text-5xl">SHOP POSTERS</h2>
          </div>
        </div>

        {/* Search + Filters */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search posters..."
              className="w-full rounded-md border border-input bg-background py-2 pl-10 pr-3 text-sm outline-none focus:border-primary"
            />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
          >
            <option value="newest">Newest</option>
            <option value="price-low">Price: Low → High</option>
            <option value="price-high">Price: High → Low</option>
          </select>
        </div>

        {/* Category Pills */}
        <div className="mb-8 flex flex-wrap gap-2">
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`rounded-full border px-4 py-1.5 text-xs uppercase tracking-wider transition-colors ${cat === c ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary hover:text-primary"}`}
            >{c}</button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="grid place-items-center rounded-xl border border-dashed border-border p-12 text-center">
            <p className="text-muted-foreground">No posters found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {filtered.map((p) => <PosterCard key={p.id} poster={p} />)}
          </div>
        )}
      </section>

      <SiteFooter />
    </div>
  );
}
