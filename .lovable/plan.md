## Netlify-ல Publish பண்ண — Full Setup Plan

உங்க project **TanStack Start** (SSR + server functions + Cloudflare Workers target). Netlify-ல சரியா வேலை செய்ய **Netlify adapter** + config files setup பண்ணணும். கீழே full plan:

---

### என்ன மாற்றணும்

**1. Netlify adapter install பண்ணணும்**
```
bun add -d @netlify/vite-plugin-tanstack-start
```
இது TanStack Start-ஐ Netlify Functions-ஆக build பண்ண உதவும்.

**2. `vite.config.ts` update**
தற்போது Cloudflare-க்கு configured. Netlify plugin-ஐ add பண்ணி, Cloudflare build target-ஐ Netlify-க்கு switch பண்ணணும்.

**3. `netlify.toml` create பண்ணணும்** (project root-ல)
```toml
[build]
  command = "bun run build"
  publish = "dist/client"

[functions]
  directory = "dist/server"
  node_bundler = "esbuild"

[[redirects]]
  from = "/*"
  to = "/.netlify/functions/server"
  status = 200
```

**4. `wrangler.jsonc` — keep பண்ணலாம்** (Lovable preview-க்கு still தேவை), but Netlify அதை ignore பண்ணும்.

**5. `package.json` scripts verify** — `build` script Netlify-க்கு compatible-ஆ இருக்கணும்.

**6. Environment variables** — Netlify dashboard-ல manually add பண்ணணும்:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`  
- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `LOVABLE_API_KEY` (AI features use பண்ணினா)

---

### முக்கியமான Warning ⚠️

இந்த project Lovable Cloud (Supabase) use பண்றது. Netlify-ல deploy பண்ணினா:
- ✅ Frontend + routes work ஆகும்
- ✅ Server functions Netlify Functions-ஆ run ஆகும்
- ⚠️ **Lovable AI Gateway** (`LOVABLE_API_KEY`) Netlify-ல auto-provision ஆகாது — manually key copy பண்ணணும், illa AI features fail ஆகும்
- ⚠️ Supabase URL/keys Lovable Cloud-ல இருந்து manually copy பண்ணி Netlify env-ல paste பண்ணணும்

---

### Steps நான் செய்வேன் (approval கொடுத்தா)

1. `@netlify/vite-plugin-tanstack-start` install பண்றேன்
2. `vite.config.ts` Netlify-க்கு update பண்றேன்
3. `netlify.toml` create பண்றேன்
4. `.gitignore` check பண்றேன் (`.netlify` folder ignore பண்ண)
5. Build run பண்ணி errors fix பண்றேன்

---

### After Plan Implementation — நீங்க செய்யறது

1. GitHub-ல code push பண்ணுங்க (Lovable-ல "GitHub" button)
2. Netlify dashboard → "Add new site" → "Import from Git"
3. Repo select பண்ணுங்க
4. Build settings auto-detect ஆகும் (`netlify.toml` இருக்கறதால)
5. Environment variables add பண்ணுங்க (மேல list பண்ணினது)
6. "Deploy" click

---

### ⭐ My Strong Recommendation

**Lovable Publish button** click பண்ணினா இதெல்லாம் **zero config-ல** automatic-ஆ வேலை செய்யும். Free `.lovable.app` domain கிடைக்கும், custom domain-ம் connect பண்ணலாம், AI + Cloud everything works out of the box.

Netlify setup complex-ஆ இருக்கும், errors வரலாம், Lovable AI key-ஐ manually manage பண்ணணும்.

---

### Confirm பண்ணுங்க

- **A)** Netlify setup pannu (மேல plan-படி full setup) — proceed?
- **B)** Lovable-ல publish பண்றேன், Netlify வேண்டாம்?

எது வேணும்னு சொல்லுங்க, அதன் படி நான் continue பண்றேன்.