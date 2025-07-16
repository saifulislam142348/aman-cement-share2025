import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import AutoImport from 'unplugin-auto-import/vite'
import path from 'path'

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
      dts: './auto-imports.d.ts', // optional: auto generate type defs
    }),
    Components({
      resolvers: [ElementPlusResolver()],
      dts: './components.d.ts', // optional: auto generate component defs
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // ✅ use cross-platform-safe version
    },
  },
})
