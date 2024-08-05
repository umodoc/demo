import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { TDesignResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      dirs: ['./src/composables'],
      imports: ['vue', 'vue-router'],
      resolvers: [
        TDesignResolver({
          library: 'vue-next',
          esm: true,
        }),
      ],
      dts: './imports.d.ts',
    }),
    Components({
      directoryAsNamespace: true,
      dirs: ['./src/components'],
      resolvers: [
        TDesignResolver({
          library: 'vue-next',
          esm: true,
        }),
      ],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
