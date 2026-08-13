import { createApp } from 'vue'
import App from './App.vue'

import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';

import {hiPrintPlugin} from './index'

// localStorage 工具函数 (替代 vue-ls)
const storage = {
  get(key, defaultValue = null) {
    try {
      const value = localStorage.getItem('hiPrint-' + key)
      return value ? JSON.parse(value) : defaultValue
    } catch {
      return defaultValue
    }
  },
  set(key, value) {
    localStorage.setItem('hiPrint-' + key, JSON.stringify(value))
  },
  remove(key) {
    localStorage.removeItem('hiPrint-' + key)
  }
}

const app = createApp(App)
app.use(Antd)
app.use(hiPrintPlugin)
app.config.globalProperties.$ls = storage
app.mount('#app')
