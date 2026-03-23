import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import type { ManifestOptions } from 'vite-plugin-pwa';

const __dirname = dirname(fileURLToPath(import.meta.url));

const manifest = JSON.parse(
  readFileSync(resolve(__dirname, 'public/manifest.json'), 'utf-8'),
) as Partial<ManifestOptions>;

/** Manifest link in dev only; production gets it from vite-plugin-pwa (devOptions.enabled: false skips injection). */
function manifestLinkDev(): Plugin {
  return {
    name: 'manifest-link-dev',
    transformIndexHtml(html, ctx) {
      if (!ctx.server || html.includes('rel="manifest"')) return html;
      return html.replace('</head>', '    <link rel="manifest" href="/manifest.json" />\n  </head>');
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    manifestLinkDev(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: { enabled: false },
      manifestFilename: 'manifest.json',
      manifest,
      includeAssets: ['icons/icon-192.png', 'icons/icon-512.png'],
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        globIgnores: [
          '**/dubai1.jpg',
          '**/person.png',
          '**/id_front.png',
          '**/id_back.png',
          '**/*.gif',
        ],
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api\//],
        runtimeCaching: [
          {
            urlPattern: /^https?:\/\/[^/]+\/api\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-network-first',
              networkTimeoutSeconds: 10,
              expiration: {
                maxEntries: 64,
                maxAgeSeconds: 86_400,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'supabase-network-first',
              networkTimeoutSeconds: 10,
              expiration: {
                maxEntries: 64,
                maxAgeSeconds: 86_400,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    }),
  ],
  build: {
    rollupOptions: {
      maxParallelFileOps: 100,
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
    include: ['react-dom/client'],
  },
});
