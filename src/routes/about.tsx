import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/about")({ component: About });

function About() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <div className="mx-auto max-w-3xl px-4 py-16 md:px-8">
        <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Our Story</div>
        <h1 className="display mt-1 text-4xl font-black md:text-6xl">ABOUT SAKSI POSTER HUB</h1>
        <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
          Saksi Poster Hub is a curated print studio for true fans — cinema, devotional, automotive and minimal art crafted on premium paper and shipped island-wide.
          Every poster is hand-picked, color-checked, and printed to last. From bedroom walls to studio collections, we make icons real.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-3 text-center">
          <Stat n="500+" l="Designs" />
          <Stat n="10K+" l="Happy Fans" />
          <Stat n="24h" l="Dispatch" />
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
function Stat({ n, l }: { n: string; l: string }) {
  return <div className="rounded-xl border border-border bg-card p-6"><div className="display text-4xl font-black text-primary">{n}</div><div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{l}</div></div>;
}
