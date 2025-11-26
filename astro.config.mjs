// @ts-check
import db from '@astrojs/db';
import netlify from '@astrojs/netlify';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import auth from 'auth-astro';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

import react from '@astrojs/react';

// import node from '@astrojs/node';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
    css: {
      devSourcemap: true, // Generate CSS source maps in dev mode
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
      },
    },
  },

  output: 'server',
  adapter: netlify(),
  // adapter: node({
  //   mode: 'standalone',
  // }),
  integrations: [db(), auth(), react()],
});