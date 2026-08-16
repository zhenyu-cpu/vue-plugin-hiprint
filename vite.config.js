import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/vue-plugin-hiprint/',
  plugins: [vue(), vueJsx()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '~@': fileURLToPath(new URL('./src', import.meta.url)),
      // concurrent-tasks 的 ESM 构建有损坏的未使用导入（setAppropriateConcurrency），
      // 会导致 dev 预打包失败；改用其 CJS 构建。
      'concurrent-tasks': fileURLToPath(new URL('./node_modules/concurrent-tasks/lib/index.js', import.meta.url)),
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
  build: {
    outDir: 'demo',
    assetsDir: 'static',
    sourcemap: false,
  },
  server: {
    port: 8080,
  },
})
