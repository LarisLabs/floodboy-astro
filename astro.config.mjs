// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

// https://github.com/withastro/astro/issues/12824
// Use react-dom/server.edge instead of react-dom/server.browser for React 19.
// Without this, MessageChannel from node:worker_threads needs to be polyfilled.
const alias = import.meta.env.PROD ? {
  "react-dom/server": "react-dom/server.edge",
} : undefined;

// https://astro.build/config
export default defineConfig({
  site: "https://example.com",
  integrations: [mdx(), sitemap(), react()],
  // Temporarily disabled due to dyld issue on macOS
  // adapter: cloudflare({
  //   platformProxy: {
  //     enabled: true,
  //   },
  //   imageService: 'compile',
  // }),
  vite: {
    plugins: [tailwindcss()],
    resolve: { alias },
    ssr: { 
      alias,
      external: ['node:buffer'],
    },
  },
});
