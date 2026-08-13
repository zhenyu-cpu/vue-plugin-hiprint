# Wayfinder Map: Vue3 + Ant Design Vue 4.x + Vite Full Rewrite

## Destination

Rewrite the vue-plugin-hiprint demo application and core library from Vue 2 + ant-design-vue 1.7.x + webpack (vue-cli) to **Vue 3 + Ant Design Vue 4.x (antdv-next) + Vite**, matching the UI and functionality of https://www.ibujian.cn/sv-print/

## Notes

- **Tech Stack Migration**: Vue 2 → Vue 3, ant-design-vue 1.x → 4.x, webpack → Vite, jQuery → native DOM
- **Reference UI**: https://www.ibujian.cn/sv-print/ — the current sv-print demo
- **Components to migrate**: App.vue, design/index.vue (~45KB), custom/index.vue, panels/index.vue, tasks/index.vue, preview.vue (×3), json-view.vue
- **Core library**: src/hiprint/ needs Vue 3 runtime compatibility
- **Build**: Replace vue-cli + webpack with Vite + @vitejs/plugin-vue

## Decisions so far

_(none yet — charting phase)_

## Tickets

| # | Ticket | Type | Status | Blocks |
|---|--------|------|--------|--------|
| [196](https://github.com/CcSimple/vue-plugin-hiprint/issues/196) | Build system: webpack → Vite | task | ✅ ready | 197, 198, 199 |
| [197](https://github.com/CcSimple/vue-plugin-hiprint/issues/197) | Vue3 entry point and app bootstrap | task | blocked by 196 | 207, 206, 209 |
| [198](https://github.com/CcSimple/vue-plugin-hiprint/issues/198) | Ant Design Vue 1.x → 4.x research | research | blocked by 196 | 200, 201, 202, 203, 204, 205, 210 |
| [199](https://github.com/CcSimple/vue-plugin-hiprint/issues/199) | Core hiprint library Vue3 compat | research | blocked by 196 | 200, 201, 202, 203, 208 |
| [200](https://github.com/CcSimple/vue-plugin-hiprint/issues/200) | Rewrite design/index.vue panel | task | blocked by 198, 199 | 211 |
| [201](https://github.com/CcSimple/vue-plugin-hiprint/issues/201) | Rewrite custom/index.vue panel | task | blocked by 198, 199 | 211 |
| [202](https://github.com/CcSimple/vue-plugin-hiprint/issues/202) | Rewrite panels/index.vue multi-panel | task | blocked by 198, 199 | 211 |
| [203](https://github.com/CcSimple/vue-plugin-hiprint/issues/203) | Rewrite tasks/index.vue batch print | task | blocked by 198, 199 | 211 |
| [204](https://github.com/CcSimple/vue-plugin-hiprint/issues/204) | Rewrite preview.vue components | task | blocked by 198 | 211 |
| [205](https://github.com/CcSimple/vue-plugin-hiprint/issues/205) | Rewrite json-view.vue | task | blocked by 198 | 211 |
| [206](https://github.com/CcSimple/vue-plugin-hiprint/issues/206) | Rewrite App.vue layout/navigation | task | blocked by 197, 198 | 211 |
| [207](https://github.com/CcSimple/vue-plugin-hiprint/issues/207) | Replace vue-ls with Vue3 storage | task | blocked by 197 | 211 |
| [208](https://github.com/CcSimple/vue-plugin-hiprint/issues/208) | Remove jQuery from hiprint core | task | blocked by 199 | 211 |
| [209](https://github.com/CcSimple/vue-plugin-hiprint/issues/209) | Adapt i18n for Vue3 | task | blocked by 197 | 211 |
| [210](https://github.com/CcSimple/vue-plugin-hiprint/issues/210) | CSS deep selector migration | task | blocked by 198 | 211 |
| [211](https://github.com/CcSimple/vue-plugin-hiprint/issues/211) | End-to-end verification | task | blocked by all | — |

### Frontier (takeable now)

- **[#196 Build system: webpack → Vite](https://github.com/CcSimple/vue-plugin-hiprint/issues/196)** — the only unblocked ticket

## Not yet specified

- Specific Ant Design Vue 4.x API changes per component (needs research)
- jQuery usage audit in hiprint core (needs research)
- Vue 3 compatibility of hiprint's template engine
- Whether to use `<script setup>` or Options API for rewritten components

## Out of scope

_(nothing ruled out yet)_
