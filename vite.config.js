// ============================================================
//  vite.config.js — Vite Build Configuration
//
//  Vite is the build tool that:
//    - Runs the local dev server (npm run dev → localhost:5173)
//    - Bundles the app for production (npm run build → /dist)
//
//  The proxy block below is ONLY for local development.
//  In production on Vercel, /api/generate is handled by the
//  serverless function in /api/generate.js automatically.
// ============================================================

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  server: {
    port: 5173, // local dev port

    // ── Dev Proxy ──────────────────────────────────────────
    // During local development, Vite proxies /api/* requests
    // to a local Express server (or you can use Vercel CLI).
    // This mirrors how Vercel routes work in production.
    proxy: {
      "/api": {
        target: "http://localhost:3001", // local API server port
        changeOrigin: true,
      },
    },
  },

  build: {
    outDir: "dist",       // output folder for production build
    sourcemap: false,     // disable sourcemaps in production
  },
});
