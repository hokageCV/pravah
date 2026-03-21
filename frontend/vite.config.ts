import { sentryVitePlugin } from '@sentry/vite-plugin';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

const pwPlugin = VitePWA({
  registerType: 'autoUpdate',
  includeAssets: ['favicon/*.png', 'sw.js'],
  manifest: {
    short_name: 'Pravah',
    name: 'Pravah',
    start_url: '.',
    display: 'standalone',
    theme_color: '#e8ca8e',
    background_color: '#fcf8f0',
    orientation: 'any',
    icons: [
      {
        src: '/favicon/favicon-16x16.png',
        sizes: '16x16',
        type: 'image/png'
      },
      {
        src: '/favicon/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png'
      },
      {
        src: '/favicon/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/favicon/maskable-icon.png',
        type: 'image/png',
        sizes: '512x512',
        purpose: 'maskable'
      }
    ],
    screenshots: [
      {
        src: '/home_page_1024x1024.png',
        sizes: '1024x1024',
        type: 'image/png',
        form_factor: 'wide'
      },
      {
        src: '/home_page_512x512.png',
        sizes: '512x512',
        type: 'image/png',
        form_factor: 'narrow'
      }
    ],
  },
  workbox: {
    globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
        handler: 'CacheFirst',
        options: {
          cacheName: 'google-fonts-cache',
          expiration: {
            maxEntries: 10,
            maxAgeSeconds: 60 * 60 * 24 * 365
          },
          cacheableResponse: {
            statuses: [0, 200]
          }
        }
      },
      {
        urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
        handler: 'CacheFirst',
        options: {
          cacheName: 'gstatic-fonts-cache',
          expiration: {
            maxEntries: 10,
            maxAgeSeconds: 60 * 60 * 24 * 365
          },
          cacheableResponse: {
            statuses: [0, 200]
          }
        }
      }
    ]
  }
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    TanStackRouterVite({ target: 'react', autoCodeSplitting: true }),
    react(),
    tailwindcss(),
    pwPlugin,
    sentryVitePlugin({
      org: 'chaitanyavaru',
      project: 'pravah',
    }),
    sentryVitePlugin({
      org: 'chaitanyavaru',
      project: 'pravah',
    }),
  ],

  build: {
    sourcemap: true,
  },
});
