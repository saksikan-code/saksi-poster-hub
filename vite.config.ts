// Lovable TanStack Start config wrapper.
// On Netlify we disable the Cloudflare plugin and add the Netlify TanStack Start plugin
// so the SSR handler is built as a Netlify Function. In the Lovable sandbox we keep
// Cloudflare enabled (default) so the live preview keeps working.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import netlifyTanstackStart from "@netlify/vite-plugin-tanstack-start";

const isNetlify = !!process.env.NETLIFY;

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  // Disable Cloudflare plugin when building on Netlify
  cloudflare: isNetlify ? false : undefined,
  // Add Netlify plugin only on Netlify
  plugins: isNetlify ? [netlifyTanstackStart()] : [],
});
