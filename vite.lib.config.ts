import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
  build: {
    // 库模式构建
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'vue-plugin-hiprint',
      formats: ['umd'],
      fileName: () => 'vue-plugin-hiprint.js',
    },
    rollupOptions: {
      // 外部依赖不打包
      external: [
        'vue',
        'ant-design-vue',
        'jquery',
        '@claviska/jquery-minicolors',
        'jsbarcode',
        'socket.io-client',
        'canvg',
        'jspdf',
        'bwip-js',
        'nzh',
        'dom-to-image-more',
      ],
      output: {
        globals: {
          vue: 'Vue',
          'ant-design-vue': 'antd',
          jquery: 'jQuery',
          '@claviska/jquery-minicolors': 'jQuery.minicolors',
          jsbarcode: 'JsBarcode',
          'socket.io-client': 'io',
          canvg: 'canvg',
          jspdf: 'jspdf',
          'bwip-js': 'bwip-js',
          nzh: 'Nzh',
          'dom-to-image-more': 'domToImage',
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'vue-plugin-hiprint.css'
          return 'assets/[name][extname]'
        },
      },
    },
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
})
