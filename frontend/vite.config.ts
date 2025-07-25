import { sentryVitePlugin } from '@sentry/vite-plugin';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    TanStackRouterVite({ target: 'react', autoCodeSplitting: true }),
    react(),
    tailwindcss(),
    VitePWA({ registerType: 'autoUpdate' }),
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
