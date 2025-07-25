// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

// Note: React 18 doesn't have server.edge export, so we'll disable this alias
// This was intended for React 19 compatibility
const alias = undefined;

// https://astro.build/config
export default defineConfig({
  site: "https://blockchain.floodboy.online",
  integrations: [mdx(), sitemap(), react()],
  adapter: cloudflare({
    mode: 'directory',
    imageService: 'compile',
    // Disable runtime features we don't need
    runtime: {
      mode: 'local',
      type: 'pages',
    },
  }),
  redirects: {
    '/': '/blockchain'
  },
  vite: {
    plugins: [tailwindcss()],
    resolve: { alias },
    ssr: { 
      alias,
      external: ['node:buffer'],
    },
  },
});
