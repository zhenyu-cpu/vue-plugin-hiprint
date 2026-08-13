<template>
  <div id="app">
    <!-- 顶部导航已移除，设计面板占满全屏 -->
    <!-- 动态渲染组件，懒得去弄路由了 -->
    <keep-alive>
      <component :is="curDemo" />
    </keep-alive>
  </div>
</template>

<script>
import printDesign from "@/demo/design/index";
import printCustom from "@/demo/custom/index";
import printTasks from "@/demo/tasks/index";
import printPanels from "@/demo/panels/index";
import templates from "@/demo/templates/index";
import { decodeVer } from "@/utils";
import { SearchOutlined } from "@ant-design/icons-vue";

export default {
  name: "App",
  components: {
    printDesign,
    printCustom,
    printTasks,
    printPanels,
    templates,
    SearchOutlined,
  },
  data() {
    return {
      curDemo: "printDesign",
      demoList: [
        { name: "printDesign", title: "默认拖拽设计" },
        { name: "printCustom", title: "自定义设计" },
        { name: "printTasks", title: "队列/批量打印" },
        { name: "printPanels", title: "多面板设计" },
      ],
      // npm 信息
      npmInfo: {},
      versions: [],
      lang: "cn",
      languages: [
        {
          label: "简体中文-cn",
          value: "cn",
        },
        {
          label: "英语-en",
          value: "en",
        },
        {
          label: "德语-de",
          value: "de",
        },
        {
          label: "西班牙语-es",
          value: "es",
        },
        {
          label: "法语-fr",
          value: "fr",
        },
        {
          label: "意大利语-it",
          value: "it",
        },
        {
          label: "日语-ja",
          value: "ja",
        },
        {
          label: "俄语-ru",
          value: "ru",
        },
        {
          label: "繁体中文-cn_tw",
          value: "cn_tw",
        },
      ],
      // 选择版本
      version: undefined,
    };
  },
  computed: {
    i18nSupport() {
      return (
        this.version == "development" ||
        (this.version && decodeVer(this.version).verVal >= 55.8)
      );
    },
  },
  created() {
    this.version = sessionStorage.getItem("version") || "development";
    this.lang = sessionStorage.getItem("lang") || "cn";
    this.getVersion();
  },
  methods: {
    /**
     * @description: 通过 jsdelivr 获取所有 npm 信息
     * @return {*}
     */
    getVersion() {
      const xhr = new XMLHttpRequest();
      // jsdelivr 源
      // xhr.open(
      //   "GET",
      //   "https://data.jsdelivr.com/v1/packages/npm/vue-plugin-hiprint"
      // );
      // cnpm 源
      xhr.open("GET", "https://registry.npmmirror.com/vue-plugin-hiprint");
      xhr.onload = () => {
        if (xhr.status === 200) {
          this.npmInfo = JSON.parse(xhr.responseText);
          this.versions = Object.keys(this.npmInfo.versions)
            .map((version) => ({
              label: version,
              value: version,
            }))
            .reverse();
          if (import.meta.env.DEV) {
            this.versions.unshift({
              label: "development",
              value: "development",
            });
          }
          this.version ??= this.versions[0].value;
        }
      };
      xhr.send();
    },
    /**
     * @description: 版本切换事件
     * @param {String} val
     */
    handleVerChange(val) {
      sessionStorage.setItem("version", val);
      location.reload();
    },
    /**
     * @description: 语言切换事件
     * @param {String} val
     */
    handleLangChange(val) {
      sessionStorage.setItem("lang", val);
      location.reload();
    },
  },
};
</script>

<style lang="less">
#app {
  height: 100vh;
  overflow: hidden;
}

// hiprint 拖拽图片
.hiprint-printElement-image-content {
  img {
    content: url("~@/assets/logo.png");
  }
}

// 修改 页眉/页脚线 样式
.hiprint-headerLine,
.hiprint-footerLine {
  border-color: red !important;
}

.hiprint-headerLine:hover,
.hiprint-footerLine:hover {
  border-top: 3px dashed red !important;
}

.hiprint-headerLine:hover:before {
  content: "页眉线";
  left: calc(50% - 18px);
  position: relative;
  background: #ffff;
  top: -12px;
  color: red;
  font-size: 12px;
}

.hiprint-footerLine:hover:before {
  content: "页脚线";
  left: calc(50% - 18px);
  position: relative;
  color: red;
  background: #ffff;
  top: -12px;
  font-size: 12px;
}
</style>
