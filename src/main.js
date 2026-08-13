import { createApp } from 'vue'
import App from './App.vue'

import Antd, { message, notification, Modal } from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';
const app = createApp(App);
app.use(Antd);

// antdv v4 静态方法挂载到全局属性，兼容 this.$xxx 语法
app.config.globalProperties.$message = message;
app.config.globalProperties.$notification = notification;
app.config.globalProperties.$modal = Modal;
app.config.globalProperties.$error = Modal.error;
app.config.globalProperties.$info = Modal.info;
app.config.globalProperties.$success = Modal.success;
app.config.globalProperties.$warning = Modal.warning;
app.config.globalProperties.$confirm = Modal.confirm;

import {hiPrintPlugin} from './index'
app.use(hiPrintPlugin)
// hiPrintPlugin.disAutoConnect();

import Storage from 'vue-ls'
let options = {
  namespace: 'hiPrint-',
  name: 'ls',
  storage: 'local',
};
app.use(Storage, options);

app.mount('#app')
