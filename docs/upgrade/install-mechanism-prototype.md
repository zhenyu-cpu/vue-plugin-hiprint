# 插件库 Vue3 安装机制 — 原型设计

> wayfinder ticket：插件库 Vue3 安装机制设计（#3）
> 原型状态：设计已完成，待 reviewer 确认

## 结论先行

**src/index.js 的 `hiPrintPlugin.install` 无需改动即可兼容 Vue2 + Vue3。** 现有代码
（`src/index.js:36-74`）已经通过 `Vue.prototype || Vue.config.globalProperties` 双兼容，
npm_demo_v3 分支（Vue3 + antdv 3.x）已实际验证 `app.use(hiPrintPlugin)` 可用。

## 现状分析

```js
install: function (Vue, name = '$hiPrint', autoConnect = true) {
  if (!autoConnect) { disAutoConnect(); }
  let globalVue = Vue.prototype || Vue.config.globalProperties;  // ← 双兼容关键行
  globalVue[name] = hiprint;
  globalVue.$print = function (provider, template, ...args) {...};
  globalVue.$print2 = function (provider, template, ...args) {...};
}
```

- Vue2 下 `Vue.use(hiPrintPlugin)` → `Vue.prototype` 命中
- Vue3 下 `app.use(hiPrintPlugin)` → `Vue.prototype` 为 undefined，回退 `Vue.config.globalProperties` 命中

## Vue3 下的行为核对

| 关注点 | Vue2 (`Vue.use`) | Vue3 (`app.use`) | 结论 |
|---|---|---|---|
| install 首参 | `Vue` 构造器 | `app` 实例 | 均含 `.prototype`/`.config.globalProperties`，走同一分支 |
| name 默认值 | `'$hiPrint'`（未传时） | 同上 | 无需改 |
| autoConnect 默认值 | `true`（未传时） | 同上 | 无需改 |
| 组件内访问 | `this.$hiPrint` / `this.$print` | Options API `this.$hiPrint` 可用 | 一致 |
| Composition API 访问 | — | `getCurrentInstance().appContext.config.globalProperties.$hiPrint` | 新能力，无需改动即可支持 |

## 注意事项（文档补强，非代码改动）

1. **`$print`/`$print2` 在 Vue3 Options API 仍可用**（globalProperties 注入 this）；`<script setup>` 需走
   `getCurrentInstance().appContext.config.globalProperties` 或直接 `import { hiprint } from 'vue-plugin-hiprint'`。
2. **esm/umd 双格式导出**：现有 `export { hiprint, hiPrintPlugin, ... }` 保留；Vite lib 构建时
   `formats: ['umd','es']` 均可，UMD 的 `name: 'vue-plugin-hiprint'` 需与 package.json main 字段对应。
3. **`install` 第三参 `autoConnect=false` 的显式调用**：Vue2/Vue3 的 `.use()` 都不会透传第三参，
   需显式 `hiPrintPlugin.install(app, '$hiPrint', false)`（与 1.x 行为一致，文档注明即可）。

## 验证清单（升级完成后执行）

- [ ] `app.use(hiPrintPlugin)` 后，Options API 组件内 `this.$hiPrint` 可访问
- [ ] `this.$print(provider, template, data)` 调起打印预览
- [ ] `hiPrintPlugin.disAutoConnect()` 直接调用生效
- [ ] npm_demo_v3 分支行为不回退

## 参考

- 现有实现：`src/index.js:36-74`
- 已验证分支：`npm_demo_v3`（Vue3 + antdv 3.x + Vite），`src/main.js` 中 `app.use(hiPrintPlugin)`
- 关联决策：构建链选型（Vite，见 #2）；demo Vue2 API 盘点（main.js 入口改造，见 #5）
