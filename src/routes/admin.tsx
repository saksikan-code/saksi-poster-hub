import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Lock, Plus, Trash2, Save, LogOut, Upload } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { fetchPosters, addPoster, deletePoster, updatePoster, uploadPosterImage, signIn, signOut, getSession, type Poster } from "@/lib/posters";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({ component: Admin });

function Admin() {
  const [auth, setAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [posters, setPosters] = useState<Poster[]>([]);
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [draft, setDraft] = useState<{ title: string; category: string; price: string; tag: string; file: File | null; preview: string }>({
    title: "", category: "", price: "", tag: "", file: null, preview: "",
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    getSession().then((session) => {
      if (session) setAuth(true);
      setLoading(false);
    });
    load();
  }, []);

  async function load() {
    const data = await fetchPosters();
    setPosters(data);
  }

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn(email, pwd);
      setAuth(true);
      toast.success("Logged in");
    } catch {
      toast.error("Invalid credentials");
    }
  };

  const logout = async () => {
    await signOut();
    setAuth(false);
  };

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setDraft({ ...draft, file, preview: URL.createObjectURL(file) });
  };

  const handleAdd = async () => {
    if (!draft.title || !draft.price || !draft.file) return toast.error("Title, price, and image required");
    setUploading(true);
    const imageUrl = await uploadPosterImage(draft.file);
    if (!imageUrl) {
      toast.error("Image upload failed");
      setUploading(false);
      return;
    }
    const result = await addPoster({
      title: draft.title,
      category: draft.category || "Custom",
      price: Number(draft.price),
      image_url: imageUrl,
      tag: draft.tag || undefined,
    });
    setUploading(false);
    if (!result) return toast.error("Failed to add poster");
    setPosters((prev) => [result, ...prev]);
    setDraft({ title: "", category: "", price: "", tag: "", file: null, preview: "" });
    toast.success("Poster added");
  };

  const handleUpdateTitle = async (id: string, title: string) => {
    const ok = await updatePoster(id, { title });
    if (ok) setPosters((prev) => prev.map((p) => (p.id === id ? { ...p, title } : p)));
  };
  const handleUpdatePrice = async (id: string, price: number) => {
    const ok = await updatePoster(id, { price });
    if (ok) setPosters((prev) => prev.map((p) => (p.id === id ? { ...p, price } : p)));
  };
  const handleDelete = async (id: string) => {
    const ok = await deletePoster(id);
    if (ok) {
      setPosters((prev) => prev.filter((p) => p.id !== id));
      toast.success("Removed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <SiteHeader />
        <div className="mx-auto grid max-w-md place-items-center px-4 py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
        <SiteFooter />
      </div>
    );
  }

  if (!auth) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <SiteHeader />
        <div className="mx-auto grid max-w-md place-items-center px-4 py-20">
          <form onSubmit={login} className="w-full rounded-xl border border-border bg-card p-8">
            <Lock className="mx-auto h-8 w-8 text-primary" />
            <h1 className="display mt-3 text-center text-3xl font-black">ADMIN ACCESS</h1>
            <p className="mt-1 text-center text-sm text-muted-foreground">Sign in with your Supabase Auth account</p>
            <input type="email" autoFocus value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="mt-4 w-full rounded-md border border-input bg-background px-3 py-3 text-sm outline-none focus:border-primary" />
            <input type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} placeholder="Password" className="mt-3 w-full rounded-md border border-input bg-background px-3 py-3 text-sm outline-none focus:border-primary" />
            <button className="mt-3 w-full rounded-md bg-primary py-3 text-sm font-bold uppercase tracking-wider text-primary-foreground">Unlock</button>
            <p className="mt-3 text-center text-[11px] text-muted-foreground">ONLY ADMIN CAN EDIT THIS</p>
          </form>
        </div>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Admin Saksi</div>
            <h1 className="display text-4xl font-black md:text-5xl">POSTER MANAGER</h1>
          </div>
          <div className="flex gap-2">
            <button onClick={logout} className="flex items-center gap-1 rounded-md border border-border px-3 py-2 text-xs uppercase tracking-wider hover:border-primary"><LogOut className="h-3 w-3" />Logout</button>
          </div>
        </div>

        {/* Add New */}
        <div className="mt-8 rounded-xl border border-border bg-card p-6">
          <div className="display text-xl font-black">ADD NEW POSTER</div>
          <div className="mt-4 grid gap-4 md:grid-cols-[200px_1fr]">
            <label className="grid aspect-[3/4] cursor-pointer place-items-center overflow-hidden rounded-md border-2 border-dashed border-border hover:border-primary">
              {draft.preview ? (
                <img src={draft.preview} className="h-full w-full object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-2 text-xs text-muted-foreground">
                  <Upload className="h-6 w-6" />
                  Click to upload
                </div>
              )}
              <input type="file" accept="image/*" onChange={onFileSelect} className="hidden" />
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder="Title *" className="rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary" />
              <input value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })} placeholder="Category (e.g. Cinema)" className="rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary" />
              <input type="number" value={draft.price} onChange={(e) => setDraft({ ...draft, price: e.target.value })} placeholder="Price (LKR) *" className="rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary" />
              <input value={draft.tag} onChange={(e) => setDraft({ ...draft, tag: e.target.value })} placeholder="Tag (New / Hot)" className="rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary" />
              <button onClick={handleAdd} disabled={uploading} className="flex items-center justify-center gap-2 rounded-md bg-primary py-2.5 text-sm font-bold uppercase tracking-wider text-primary-foreground disabled:opacity-50 sm:col-span-2">
                {uploading ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                {uploading ? "Uploading..." : "Add Poster"}
              </button>
            </div>
          </div>
        </div>

        {/* Manage */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posters.map((p) => (
            <div key={p.id} className="overflow-hidden rounded-xl border border-border bg-card">
              <img src={p.image_url} alt={p.title} className="aspect-[3/4] w-full object-cover" />
              <div className="space-y-2 p-4">
                <input defaultValue={p.title} onBlur={(e) => handleUpdateTitle(p.id, e.target.value)} className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm outline-none focus:border-primary" />
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">LKR</span>
                  <input type="number" defaultValue={p.price} onBlur={(e) => handleUpdatePrice(p.id, Number(e.target.value))} className="flex-1 rounded-md border border-input bg-background px-2 py-1.5 text-sm outline-none focus:border-primary" />
                  <Save className="h-3 w-3 text-muted-foreground" />
                </div>
                <button onClick={() => handleDelete(p.id)} className="flex w-full items-center justify-center gap-2 rounded-md border border-border py-2 text-xs uppercase tracking-wider text-muted-foreground hover:border-destructive hover:text-destructive"><Trash2 className="h-3 w-3" /> Remove</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
