<template>
  <div class="design-app">
    <!-- ====== HEADER BAR ====== -->
    <header class="design-header">
      <div class="header-left">
        <img src="~@/assets/logo.png" class="header-logo" />
        <span class="header-title">hiprint</span>
      </div>

      <div class="header-center">
        <!-- 基础 下拉 -->
        <a-dropdown :trigger="['hover']" :getPopupContainer="el => el.parentNode">
          <div class="header-element-trigger">
            <AppstoreOutlined /><span>基础</span>
          </div>
          <template #overlay>
            <div class="element-dropdown-grid">
              <a class="ep-draggable-item" tid="defaultModule.hline"><MinusOutlined /><span>横线</span></a>
              <a class="ep-draggable-item" tid="defaultModule.vline"><VerticalAlignMiddleOutlined /><span>竖线</span></a>
              <a class="ep-draggable-item" tid="defaultModule.rect"><BorderOutlined /><span>矩形</span></a>
              <a class="ep-draggable-item" tid="defaultModule.oval"><ApartmentOutlined /><span>椭圆</span></a>
            </div>
          </template>
        </a-dropdown>

        <!-- 单独元素项 -->
        <div class="header-element-item ep-draggable-item" tid="defaultModule.text">
          <FontSizeOutlined /><span>文本</span>
        </div>
        <div class="header-element-item ep-draggable-item" tid="defaultModule.image">
          <PictureOutlined /><span>图片</span>
        </div>
        <div class="header-element-item ep-draggable-item" tid="defaultModule.qrcode">
          <QrcodeOutlined /><span>二维码</span>
        </div>
        <div class="header-element-item ep-draggable-item" tid="defaultModule.barcode">
          <BarcodeOutlined /><span>条形码</span>
        </div>
        <div class="header-element-item ep-draggable-item" tid="defaultModule.longText">
          <ProfileOutlined /><span>长文</span>
        </div>
        <div class="header-element-item ep-draggable-item" tid="defaultModule.table">
          <TableOutlined /><span>表格</span>
        </div>
        <div class="header-element-item ep-draggable-item" tid="defaultModule.html">
          <CodeOutlined /><span>HTML</span>
        </div>
        <div class="header-element-item ep-draggable-item" tid="defaultModule.emptyTable">
          <AppstoreOutlined /><span>空白表格</span>
        </div>
        <div class="header-element-item ep-draggable-item" tid="defaultModule.customText">
          <EditOutlined /><span>自定义</span>
        </div>
      </div>

      <div class="header-right">
        <div class="header-action" @click="clearPaper">
          <FileAddOutlined /><span>新建</span>
        </div>
        <a-dropdown :trigger="['hover']" :getPopupContainer="el => el.parentNode">
          <div class="header-action">
            <FolderOutlined /><span>模板</span>
          </div>
          <template #overlay>
            <a-menu @click="handleMenuClick">
              <a-menu-item key="5">模板导入导出</a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
        <a-dropdown :trigger="['hover']" :getPopupContainer="el => el.parentNode">
          <div class="header-action">
            <ExportOutlined /><span>更多</span>
          </div>
          <template #overlay>
            <a-menu @click="handleMenuClick">
              <a-menu-item key="0">都不看,我就不看</a-menu-item>
              <a-menu-item v-for="item in keyList" :key="item.key">{{ item.name }}</a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
        <div class="header-action" @click="preView">
          <EyeOutlined /><span>预览</span>
        </div>
        <json-view :template="template" />
      </div>
    </header>

    <!-- ====== TOOLBAR ====== -->
    <div class="design-toolbar">
      <div class="toolbar-left">
        <!-- 左侧面板切换 -->
        <div class="tool-btn" :class="{ active: showLeftPanel }" @click="showLeftPanel = !showLeftPanel" title="组件面板">
          <MenuOutlined />
        </div>
        <span class="tool-gap"></span>
        <!-- 撤销/重做 -->
        <div class="tool-btn disabled" title="撤销 (Ctrl+Z)">
          <UndoOutlined />
        </div>
        <div class="tool-btn disabled" title="重做 (Ctrl+Shift+Z)">
          <RedoOutlined />
        </div>
        <span class="tool-gap"></span>
        <!-- 对齐 -->
        <div class="tool-btn disabled" title="左对齐" @click="setElsAlign('left')"><AlignLeftOutlined /></div>
        <div class="tool-btn disabled" title="水平居中" @click="setElsAlign('vertical')"><AlignCenterOutlined /></div>
        <div class="tool-btn disabled" title="右对齐" @click="setElsAlign('right')"><AlignRightOutlined /></div>
        <div class="tool-btn disabled" title="顶部对齐" @click="setElsAlign('top')"><VerticalAlignTopOutlined /></div>
        <div class="tool-btn disabled" title="垂直居中" @click="setElsAlign('horizontal')"><VerticalAlignMiddleOutlined /></div>
        <div class="tool-btn disabled" title="底部对齐" @click="setElsAlign('bottom')"><VerticalAlignBottomOutlined /></div>
        <span class="tool-gap"></span>
        <!-- 分散 -->
        <div class="tool-btn disabled" title="水平分散" @click="setElsAlign('distributeHor')"><ColumnWidthOutlined /></div>
        <div class="tool-btn disabled" title="垂直分散" @click="setElsAlign('distributeVer')"><ColumnHeightOutlined /></div>
      </div>

      <div class="toolbar-center">
        <!-- 纸张大小 -->
        <div class="paper-sizes">
          <template v-for="(value, type) in paperTypes" :key="type">
            <div class="paper-size-btn" :class="{ active: curPaperType === type }" @click="setPaper(type, value)">
              {{ type }}
            </div>
          </template>
          <a-popover v-model:open="paperPopVisible" title="设置纸张宽高(mm)" trigger="click">
            <template #content>
              <a-input-group compact style="margin: 10px">
                <a-input type="number" v-model:value="paperWidth" style="width: 100px; text-align: center" placeholder="宽(mm)" />
                <a-input style="width: 30px; border-left: 0; pointer-events: none; background: #fff" placeholder="~" disabled />
                <a-input type="number" v-model:value="paperHeight" style="width: 100px; text-align: center; border-left: 0" placeholder="高(mm)" />
              </a-input-group>
              <a-button type="primary" style="width: 100%" @click="otherPaper">确定</a-button>
            </template>
            <div class="paper-size-btn" :class="{ active: curPaperType === 'other' }">自定义</div>
          </a-popover>
        </div>
        <span class="tool-gap"></span>
        <!-- 缩放 -->
        <div class="tool-btn" @click="changeScale(false)"><ZoomOutOutlined /></div>
        <div class="scale-value">{{ (scaleValue * 100).toFixed(0) }}%</div>
        <div class="tool-btn" @click="changeScale(true)"><ZoomInOutlined /></div>
        <span class="tool-gap"></span>
        <div class="tool-btn" @click="rotatePaper()" title="旋转"><RotateRightOutlined /></div>
      </div>

      <div class="toolbar-right">
        <!-- 右侧面板切换 -->
        <div class="tool-btn" :class="{ active: showRightPanel }" @click="showRightPanel = !showRightPanel" title="属性面板">
          <SettingOutlined />
        </div>
        <span class="tool-gap"></span>
        <a-popconfirm title="是否确认清空?" okType="danger" okText="确定清空" @confirm="clearPaper">
          <div class="tool-btn danger" title="清空"><DeleteOutlined /></div>
        </a-popconfirm>
      </div>
    </div>

    <!-- ====== MAIN CONTENT ====== -->
    <div class="design-main">
      <!-- 左侧面板 -->
      <div class="left-panel" v-show="showLeftPanel">
        <div class="panel-header">
          <span>组件面板</span>
        </div>
        <div class="panel-body hiprintEpContainer rect-printElement-types">
          <a-collapse v-model:activeKey="activeCollapse" ghost>
            <a-collapse-panel key="basic" header="基础打印">
              <div class="element-grid">
                <div class="element-item">
                  <a class="ep-draggable-item" tid="defaultModule.text">
                    <div class="element-icon"><FontSizeOutlined /></div>
                    <span class="element-label">文本</span>
                  </a>
                </div>
                <div class="element-item">
                  <a class="ep-draggable-item" tid="defaultModule.image">
                    <div class="element-icon"><PictureOutlined /></div>
                    <span class="element-label">图片</span>
                  </a>
                </div>
                <div class="element-item">
                  <a class="ep-draggable-item" tid="defaultModule.longText">
                    <div class="element-icon"><ProfileOutlined /></div>
                    <span class="element-label">长文</span>
                  </a>
                </div>
                <div class="element-item">
                  <a class="ep-draggable-item" tid="defaultModule.table">
                    <div class="element-icon"><TableOutlined /></div>
                    <span class="element-label">表格</span>
                  </a>
                </div>
                <div class="element-item">
                  <a class="ep-draggable-item" tid="defaultModule.emptyTable">
                    <div class="element-icon"><AppstoreOutlined /></div>
                    <span class="element-label">空白表格</span>
                  </a>
                </div>
                <div class="element-item">
                  <a class="ep-draggable-item" tid="defaultModule.html">
                    <div class="element-icon"><CodeOutlined /></div>
                    <span class="element-label">HTML</span>
                  </a>
                </div>
                <div class="element-item">
                  <a class="ep-draggable-item" tid="defaultModule.customText">
                    <div class="element-icon"><EditOutlined /></div>
                    <span class="element-label">自定义文本</span>
                  </a>
                </div>
              </div>
            </a-collapse-panel>
            <a-collapse-panel key="auxiliary" header="辅助元素">
              <div class="element-grid">
                <div class="element-item">
                  <a class="ep-draggable-item" tid="defaultModule.hline">
                    <div class="element-icon"><MinusOutlined /></div>
                    <span class="element-label">横线</span>
                  </a>
                </div>
                <div class="element-item">
                  <a class="ep-draggable-item" tid="defaultModule.vline">
                    <div class="element-icon"><VerticalAlignMiddleOutlined /></div>
                    <span class="element-label">竖线</span>
                  </a>
                </div>
                <div class="element-item">
                  <a class="ep-draggable-item" tid="defaultModule.rect">
                    <div class="element-icon"><BorderOutlined /></div>
                    <span class="element-label">矩形</span>
                  </a>
                </div>
                <div class="element-item">
                  <a class="ep-draggable-item" tid="defaultModule.oval">
                    <div class="element-icon"><ApartmentOutlined /></div>
                    <span class="element-label">椭圆</span>
                  </a>
                </div>
              </div>
            </a-collapse-panel>
            <a-collapse-panel v-if="currVerInfo.verVal >= 55.3" key="barcode" header="条码">
              <div class="element-grid">
                <div class="element-item">
                  <a class="ep-draggable-item" tid="defaultModule.barcode">
                    <div class="element-icon"><BarcodeOutlined /></div>
                    <span class="element-label">条形码</span>
                  </a>
                </div>
                <div class="element-item">
                  <a class="ep-draggable-item" tid="defaultModule.qrcode">
                    <div class="element-icon"><QrcodeOutlined /></div>
                    <span class="element-label">二维码</span>
                  </a>
                </div>
              </div>
            </a-collapse-panel>
          </a-collapse>
        </div>
      </div>

      <!-- 画布区域 -->
      <div class="design-canvas">
        <div id="hiprint-printTemplate" class="hiprint-printTemplate"></div>
      </div>

      <!-- 右侧属性面板 -->
      <div class="right-panel" v-show="showRightPanel">
        <div class="panel-header">
          <span>属性设置</span>
        </div>
        <div class="panel-body">
          <div id="PrintElementOptionSetting"></div>
        </div>
      </div>
    </div>

    <!-- ====== 扩展功能区域（按需显示） ====== -->
    <div class="design-extensions" v-if="curKey">
      <a-space v-if="'1' == curKey">
        <div class="ext-label">直接打印/api打印:</div>
        <a-button type="primary" @click="print"><template #icon><PrinterOutlined /></template>直接打印</a-button>
        <a-button type="primary" @click="printByFragments"><template #icon><PrinterOutlined /></template>分批直接打印</a-button>
        <a-button type="primary" @click="onlyPrint">Api单独打印</a-button>
        <a-button type="primary" @click="onlyPrint2">Api单独直接打印</a-button>
      </a-space>
      <a-space v-if="'2' == curKey">
        <div class="ext-label">导出PDF文件/流:</div>
        <a-button type="primary" @click="exportPdf('')">导出获取pdf(Blob)</a-button>
        <a-button type="primary" @click="exportPdf('arraybuffer')">导出获取pdf(ArrayBuffer)</a-button>
        <a-button type="primary" @click="exportPdf('dataurl')">导出获取pdf(DataUrl)</a-button>
        <a-button type="primary" @click="exportPdf('bloburl')">导出获取pdf(BlobUrl)</a-button>
        <a-button type="primary" @click="exportPdf('dataurlstring')">导出获取pdf(DataUrlString)</a-button>
        <a-button type="primary" @click="exportPdf('pdfobjectnewwindow')">导出查看pdf(PdfObjectNewWindow)</a-button>
      </a-space>
      <a-space v-if="'3' == curKey">
        <div class="ext-label">ipp打印(需打印机支持):</div>
        <a-button type="primary" @click="ippPrintAttr">ipp获取 打印机 参数情况</a-button>
        <a-button type="primary" @click="ippPrintTest">ipp打印测试</a-button>
        <a-button type="primary" @click="ippRequestTest">ipp请求 获取 打印机 参数情况</a-button>
        <a-button type="primary" @click="ippRequestPrint">ipp请求 打印测试</a-button>
      </a-space>
      <a-space v-if="'4' == curKey">
        <div class="ext-label">元素参数操作:</div>
        <a-button type="primary" @click="setOptionConfig(-1)">测试隐藏参数[看代码]</a-button>
        <a-button type="primary" @click="setOptionConfig(1)">隐藏[文本] "边框"、"高级"</a-button>
        <a-button type="primary" @click="setOptionConfig(2)">[图片]不分组</a-button>
        <a-button type="primary" @click="setOptionConfig(3)">重写[文本] "字体大小"、"元素层级"</a-button>
        <a-button type="primary" @click="setOptionConfig(4)">[文本]新增 "缩放"</a-button>
        <a-button type="primary" @click="setOptionConfig(0)">还原配置</a-button>
      </a-space>
      <a-space v-if="'5' == curKey">
        <div class="ext-label">模板导入导出:</div>
        <a-textarea style="width:30vw" v-model:value="jsonIn" @pressEnter="updateJson" placeholder="复制json模板到此后 点击右侧更新" allow-clear />
        <a-button type="primary" @click="updateJson">更新json模板</a-button>
        <a-button type="primary" @click="exportJson">导出json模板到 textArea</a-button>
        <a-textarea style="width:30vw" v-model:value="jsonOut" placeholder="点击左侧导出json" allow-clear />
      </a-space>
      <a-space v-if="'6' == curKey">
        <div class="ext-label">元素获取/更新参数:</div>
        <a-button type="primary" @click="getSelectEls">获取选中元素</a-button>
        <a-button type="primary" @click="setEleSelectByField">设置根据field选中文本元素</a-button>
        <a-button type="primary" @click="updateFontSize">选中元素字体12pt</a-button>
        <a-button type="primary" @click="updateFontWeight">选中元素字体Bolder</a-button>
      </a-space>
      <a-space v-if="'7' == curKey">
        <div class="ext-label">元素对齐/间距(需先选中):</div>
        <a-button type="primary" @click="setElsSpace(true)">水平间距10</a-button>
        <a-button type="primary" @click="setElsSpace(false)">垂直间距10</a-button>
        <a-radio-group>
          <a-radio-button @click="setElsAlign('left')" title="左对齐"><template #default><AlignLeftOutlined /></template></a-radio-button>
          <a-radio-button @click="setElsAlign('vertical')" title="居中"><template #default><AlignCenterOutlined /></template></a-radio-button>
          <a-radio-button @click="setElsAlign('right')" title="右对齐"><template #default><AlignRightOutlined /></template></a-radio-button>
          <a-radio-button @click="setElsAlign('top')" title="顶部对齐"><template #default><VerticalAlignTopOutlined /></template></a-radio-button>
          <a-radio-button @click="setElsAlign('horizontal')" title="垂直居中"><template #default><VerticalAlignMiddleOutlined /></template></a-radio-button>
          <a-radio-button @click="setElsAlign('bottom')" title="底部对齐"><template #default><VerticalAlignBottomOutlined /></template></a-radio-button>
          <a-radio-button @click="setElsAlign('distributeHor')" title="横向分散"><template #default><ColumnWidthOutlined /></template></a-radio-button>
          <a-radio-button @click="setElsAlign('distributeVer')" title="纵向分散"><template #default><ColumnHeightOutlined /></template></a-radio-button>
        </a-radio-group>
      </a-space>
    </div>

    <!-- 预览 -->
    <print-preview ref="preView" />
  </div>
</template>
<script defer>
import * as vuePluginHiprint from '../../index'
import printData from './print-data'
import printPreview from './preview'
import jsonView from "../json-view.vue";
import fontSize from "./font-size.js";
import scale from "./scale.js";
import {decodeVer} from '@/utils'
import {
  AppstoreOutlined, FontSizeOutlined, PictureOutlined, ProfileOutlined,
  TableOutlined, CodeOutlined, EditOutlined, MinusOutlined,
  VerticalAlignMiddleOutlined, BorderOutlined, ApartmentOutlined,
  BarcodeOutlined, QrcodeOutlined, FileAddOutlined, FolderOutlined,
  ExportOutlined, EyeOutlined,
  MenuOutlined, UndoOutlined, RedoOutlined, AlignLeftOutlined,
  AlignCenterOutlined, AlignRightOutlined, VerticalAlignTopOutlined,
  VerticalAlignBottomOutlined, ColumnWidthOutlined, ColumnHeightOutlined,
  ZoomOutOutlined, ZoomInOutlined, RotateRightOutlined,
  SettingOutlined, DeleteOutlined, PrinterOutlined,
  DownOutlined, QuestionCircleOutlined, CloseOutlined, SaveOutlined
} from "@ant-design/icons-vue";

var hiprint, defaultElementTypeProvider, panel;
let hiprintTemplate;

export default {
  name: "printDesign",
  components: {
    printPreview, jsonView,
    AppstoreOutlined, FontSizeOutlined, PictureOutlined, ProfileOutlined,
    TableOutlined, CodeOutlined, EditOutlined, MinusOutlined,
    VerticalAlignMiddleOutlined, BorderOutlined, ApartmentOutlined,
    BarcodeOutlined, QrcodeOutlined, FileAddOutlined, FolderOutlined,
    ExportOutlined, EyeOutlined,
    MenuOutlined, UndoOutlined, RedoOutlined, AlignLeftOutlined,
    AlignCenterOutlined, AlignRightOutlined, VerticalAlignTopOutlined,
    VerticalAlignBottomOutlined, ColumnWidthOutlined, ColumnHeightOutlined,
    ZoomOutOutlined, ZoomInOutlined, RotateRightOutlined,
    SettingOutlined, DeleteOutlined, PrinterOutlined,
    DownOutlined, QuestionCircleOutlined, CloseOutlined, SaveOutlined
  },
  data() {
    return {
      showLeftPanel: true,
      showRightPanel: true,
      activeCollapse: ['basic'],
      template: null,
      curPaper: { type: 'A4', width: 210, height: 296.6 },
      paperTypes: {
        'A3': { width: 420, height: 296.6 },
        'A4': { width: 210, height: 296.6 },
        'A5': { width: 210, height: 147.6 },
        'B3': { width: 500, height: 352.6 },
        'B4': { width: 250, height: 352.6 },
        'B5': { width: 250, height: 175.6 }
      },
      paperPopVisible: false,
      paperWidth: '220',
      paperHeight: '80',
      scaleValue: 1,
      scaleMax: 5,
      scaleMin: 0.5,
      jsonIn: '',
      jsonOut: '',
      curKey: '',
      keyList: [
        {key: 1, name: '直接打印/api打印'},
        {key: 2, name: '导出PDF文件/流'},
        {key: 3, name: 'ipp打印(需打印机支持)'},
        {key: 4, name: '元素参数操作'},
        {key: 5, name: '模板导入导出'},
        {key: 6, name: '元素获取/更新参数'},
        {key: 7, name: '元素对齐/间距(需先选中)'},
      ],
    }
  },
  computed: {
    curPaperType() {
      let type = 'other'
      let types = this.paperTypes
      for (const key in types) {
        let item = types[key]
        let {width, height} = this.curPaper
        if (item.width === width && item.height === height) { type = key }
      }
      return type
    },
    currVerInfo() {
      if (this.$parent.version && this.$parent.version != "development") {
        return decodeVer(this.$parent.version)
      } else if (hiprint?.version) {
        return decodeVer(hiprint.version)
      } else {
        return { verVal: 9999 }
      }
    }
  },
  mounted() {
    this.getPanel()
    if (this.$parent.version && this.$parent.version != "development") {
      this.getVersion(this.$parent.version)
    } else {
      hiprint = vuePluginHiprint.hiprint
      defaultElementTypeProvider = vuePluginHiprint.defaultElementTypeProvider
      this.init()
    }
  },
  methods: {
    getPanel() {
      const panelModules = import.meta.glob('./panel*.js', { eager: true })
      var panelInfos = Object.keys(panelModules).map(key => ({
        ...decodeVer(key.replace(/(\.\/panel-?)|(\.js)/g, '')),
        key
      }))
      if (this.$parent.version && this.$parent.version != "development") {
        var currVerInfo = decodeVer(this.$parent.version)
        var newVers = panelInfos.filter(({verVal}) => verVal <= currVerInfo.verVal)
          .sort((acc, curr) => curr.verVal - acc.verVal)
        panel = panelModules[newVers[0].key].default
      } else {
        panel = panelModules['./panel.js'].default
      }
    },
    getVersion(version) {
      const script = document.createElement("script");
      script.setAttribute("type", "text/javascript");
      script.setAttribute("src", `https://unpkg.com/vue-plugin-hiprint@${version}/dist/vue-plugin-hiprint.js`);
      script.addEventListener("load", () => {
        hiprint = window['vue-plugin-hiprint'].hiprint
        defaultElementTypeProvider = window['vue-plugin-hiprint'].defaultElementTypeProvider
        this.init()
      })
      const head = document.querySelector("head");
      head.querySelector('link[media=print][href*="print-lock.css"]').remove();
      head.append($(`<link rel="stylesheet" type="text/css" media="print" href="https://unpkg.com/vue-plugin-hiprint@${version}/dist/print-lock.css">`)[0])
      head.append(script)
    },
    init() {
      hiprint.init({
        providers: [new defaultElementTypeProvider()],
        lang: this.$parent.lang
      });
      hiprint.setConfig()
      hiprint.PrintElementTypeManager.buildByHtml($('.ep-draggable-item'));
      $('#hiprint-printTemplate').empty()
      let that = this;
      this.template = hiprintTemplate = new hiprint.PrintTemplate({
        template: panel,
        onImageChooseClick: (target) => {
          setTimeout(() => {
            target.refresh("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAtAAAAIIAQMAAAB99EudAAAABlBMVEUmf8vG2O41LStnAAABD0lEQVR42u3XQQqCQBSAYcWFS4/QUTpaHa2jdISWLUJjjMpclJoPGvq+1WsYfiJCZ4oCAAAAAAAAAAAAAAAAAHin6pL9c6H/fOzHbRrP0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0u/SY9LS0tLS0tLS0tLS0n+edm+UlpaWlpaWlpaWlpaW/tl0Ndyzbno7/+tPTJdd1wal69dNa6abx+Lq6TSeYtK7BX/Diek0XULSZZrakPRtV0i6Hu/KIt30q4fM0pvBqvR9mvsQkZaW9gyJT+f5lsnzjR54xAk8mAUeJyMPwYFH98ALx5Jr0kRLLndT7b64UX9QR/0eAAAAAAAAAAAAAAAAAAD/4gpryzr/bja4QgAAAABJRU5ErkJggg==", { real: true })
          }, 3000)
        },
        fontList: [
          {title: '微软雅黑', value: 'Microsoft YaHei'},
          {title: '黑体', value: 'STHeitiSC-Light'},
          {title: '思源黑体', value: 'SourceHanSansCN-Normal'},
          {title: '王羲之书法体', value: '王羲之书法体'},
          {title: '宋体', value: 'SimSun'},
          {title: '华为楷体', value: 'STKaiti'},
          {title: 'cursive', value: 'cursive'},
        ],
        dataMode: 1,
        history: true,
        willOutOfBounds: true,
        qtDesigner: true,
        onDataChanged: (type, json) => { console.log(type); console.log(json); },
        onUpdateError: (e) => { console.log(e); },
        settingContainer: '#PrintElementOptionSetting',
        paginationContainer: '.hiprint-printPagination'
      });
      hiprintTemplate.design('#hiprint-printTemplate', {grid: true});
      this.scaleValue = hiprintTemplate.editingPanel.scale || 1;
    },
    setOptionConfig(type) {
      switch (type) {
        case -1:
          hiprint.setConfig({
            movingDistance: 2.5,
            text: { tabs: [{ options: [{ name: 'fixed', hidden: true }] }], supportOptions: [{ name: 'styler', hidden: true }, { name: 'formatter', hidden: true }] },
            image: { tabs: [{ replace: true, name: '基本', options: [{ name: 'field', hidden: false }, { name: 'src', hidden: false }, { name: 'fit', hidden: false }] }] }
          })
          break;
        case 0: hiprint.setConfig(); break;
        case 1:
          hiprint.setConfig({ text: { tabs: [{}, {}, { name: '边框', replace: true, options: [] }, { name: '高级', replace: true, options: [] }] } });
          break
        case 2: hiprint.setConfig({ image: { tabs: [], supportOptions: [] } }); break;
        case 3:
          hiprint.setConfig({
            optionItems: [
              fontSize,
              function () {
                function t() { this.name = "zIndex"; }
                return t.prototype.css = function (t, e) { if (t && t.length) { if (e) return t.css('z-index', e); } return null; },
                  t.prototype.createTarget = function () {
                    return this.target = $('<div class="hiprint-option-item"><div class="hiprint-option-item-label">元素层级2</div><div class="hiprint-option-item-field"><input type="number" class="auto-submit"/></div></div>'), this.target;
                  }, t.prototype.getValue = function () { var t = this.target.find("input").val(); if (t) return parseInt(t.toString()); },
                  t.prototype.setValue = function (t) { this.target.find("input").val(t); },
                  t.prototype.destroy = function () { this.target.remove(); }, t;
              }(),
            ]
          });
          break;
        case 4:
          hiprint.setConfig({
            optionItems: [scale],
            movingDistance: 2.5,
            text: { tabs: [{}, { name: '样式', options: [{ name: 'scale', after: 'transform', hidden: false }] }] }
          });
          break;
      }
      hiprintTemplate.editingPanel.printElements.forEach((e) => {
        if (e._printElementOptionTabs) delete e._printElementOptionTabs;
        if (e._printElementOptionItems) delete e._printElementOptionItems;
      });
      let els = hiprintTemplate.getSelectEls();
      els && els.length && els[0].designTarget.trigger($.Event('click'));
    },
    setPaper(type, value) {
      try {
        if (Object.keys(this.paperTypes).includes(type)) {
          this.curPaper = {type: type, width: value.width, height: value.height}
          hiprintTemplate.setPaper(value.width, value.height)
        } else {
          this.curPaper = {type: 'other', width: value.width, height: value.height}
          hiprintTemplate.setPaper(value.width, value.height)
        }
      } catch (error) { this.$message.error(`操作失败: ${error}`) }
    },
    otherPaper() {
      let value = { width: this.paperWidth, height: this.paperHeight }
      this.paperPopVisible = false
      this.setPaper('other', value)
    },
    changeScale(big) {
      let scaleValue = this.scaleValue;
      if (big) { scaleValue += 0.1; if (scaleValue > this.scaleMax) scaleValue = 5; }
      else { scaleValue -= 0.1; if (scaleValue < this.scaleMin) scaleValue = 0.5; }
      if (hiprintTemplate) { hiprintTemplate.zoom(scaleValue); this.scaleValue = scaleValue; }
    },
    rotatePaper() { if (hiprintTemplate) hiprintTemplate.rotatePaper() },
    preView() {
      hiprint.updateElementType('defaultModule.text', (type) => { type.title = '这是更新后的元素'; return type })
      hiprint.refreshPrinterList((list) => { console.log('refreshPrinterList', list) });
      hiprint.getAddress('ip', (data) => { console.log('ip', data) })
      hiprint.getAddress('ipv6', (data) => { console.log('ipv6', data) })
      hiprint.getAddress('mac', (data) => { console.log('mac', data) })
      hiprint.getAddress('dns', (data) => { console.log('dns', data) })
      hiprint.getAddress('all', (data) => { console.log('all', data) })
      hiprint.getAddress('interface', (data) => { console.log('interface', data) }, 'IPv4', 'eth1')
      this.$refs.preView.show(hiprintTemplate, printData)
    },
    onlyPrint() {
      let ht = this.$print(undefined, panel, printData, {}, {
        styleHandler: () => { return '<link href="http://hiprint.io/Content/hiprint/css/print-lock.css" media="print" rel="stylesheet">' }
      })
      console.log(ht);
    },
    onlyPrint2() {
      let that = this;
      if (window.hiwebSocket.opened) {
        let ht = this.$print2(undefined, panel, printData, {
          printer: '', title: 'Api单独打印',
          styleHandler: () => { return '<style>.hiprint-printElement-text{color:red !important;}</style>' }
        })
        let key = 'Api单独直接打印';
        ht.on('printSuccess', function () {
          that.$notification.success({ key, placement: 'topRight', message: key + ' 打印成功', description: 'Api单独直接打印回调' });
        });
        return;
      }
      this.$error({ title: "客户端未连接", content: '连接【' + hiwebSocket.host + '】失败！请确保目标服务器已下载并运行打印服务！' });
    },
    handleMenuClick(e) { this.curKey = e.key; },
    print() {
      this.doOperationWhenClientConnected(() => {
        hiprintTemplate.print2(printData, {printer: '', title: 'hiprint测试打印'});
      })
    },
    printByFragments() {
      this.doOperationWhenClientConnected(() => {
        const dataList = new Array(50).fill(printData)
        hiprintTemplate.print2(dataList, { printer: '', title: 'hiprint测试打印', printByFragments: true });
      })
    },
    doOperationWhenClientConnected(operation) {
      if (window.hiwebSocket.opened) { operation?.(); return }
      this.$error({ title: "客户端未连接", content: '连接【' + hiwebSocket.host + '】失败！请确保目标服务器已下载并运行打印服务！' });
    },
    clearPaper() {
      try { hiprintTemplate.clear(); } catch (error) { this.$message.error(`操作失败: ${error}`); }
    },
    exportPdf(type) {
      hiprintTemplate.toPdf(printData, '测试导出pdf', {isDownload: false, type: type}).then((res) => { console.log('type:', type, res); });
    },
    ippPrintAttr() {
      const printerList = hiprintTemplate.getPrinterList();
      if (!printerList.length) return;
      let url = printerList[0].options['printer-uri-supported'];
      hiprint.ippPrint({ url, opt: {}, action: 'Get-Printer-Attributes', message: null }, (res) => { console.log(res) }, (printer) => { console.log(printer) })
    },
    ippPrintTest() {
      const printerList = hiprintTemplate.getPrinterList();
      if (!printerList.length) return;
      let url = printerList[0].options['printer-uri-supported'];
      hiprint.ippPrint({
        url, opt: {}, action: 'Print-Job',
        message: {
          "operation-attributes-tag": { "requesting-user-name": "hiPrint", "job-name": "ipp Test Job", "document-format": "text/plain" },
          data: 'test test test test test test test', encoding: 'utf-8'
        }
      }, (res) => { console.log(res) }, (printer) => { console.log(printer) })
    },
    ippRequestTest() {
      const printerList = hiprintTemplate.getPrinterList();
      if (!printerList.length) return;
      let url = printerList[0].options['printer-uri-supported'];
      hiprint.ippRequest({
        url,
        data: { "operation": "Get-Printer-Attributes", "operation-attributes-tag": { "attributes-charset": "utf-8", "attributes-natural-language": "zh-cn", "printer-uri": url } }
      }, (res) => { console.log(res) })
    },
    ippRequestPrint() {
      const printerList = hiprintTemplate.getPrinterList();
      if (!printerList.length) return;
      let url = printerList[0].options['printer-uri-supported'];
      let str = "ippRequestPrint ippRequestPrint ippRequestPrint";
      let array = new Uint8Array(str.length);
      for (var i = 0; i < str.length; i++) { array[i] = str.charCodeAt(i); }
      hiprint.ippRequest({
        url,
        data: {
          "operation": "Print-Job",
          "operation-attributes-tag": { "attributes-charset": "utf-8", "attributes-natural-language": "zh-cn", "printer-uri": url, "requesting-user-name": "hiPrint", "job-name": "ipp Request Job", "document-format": "text/plain" },
          data: array.buffer
        }
      }, (res) => { console.log(res) })
    },
    updateJson() {
      if (hiprintTemplate) {
        try { hiprintTemplate.update(JSON.parse(this.jsonIn)) } catch (e) { this.$message.error(`更新失败: ${e}`) }
      }
    },
    exportJson() {
      if (hiprintTemplate) { this.jsonOut = JSON.stringify(hiprintTemplate.getJson() || {}) }
    },
    setElsAlign(e) { hiprintTemplate.setElsAlign(e) },
    setElsSpace(h) { hiprintTemplate.setElsSpace(10, h) },
    setEleSelectByField() { hiprintTemplate.selectElementsByField(['name']) },
    getSelectEls() { let els = hiprintTemplate.getSelectEls(); console.log(els) },
    updateFontSize() { hiprintTemplate.updateOption('fontSize', 12); },
    updateFontWeight() { hiprintTemplate.updateOption('fontWeight', 'bolder'); }
  }
}
</script>
<style lang="less" scoped>
/* ====== GLOBAL LAYOUT ====== */
.design-app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f5f5f5;
  overflow: hidden;
}

/* ====== HEADER BAR ====== */
.design-header {
  display: flex;
  align-items: center;
  height: 42px;
  background: #fff;
  border-bottom: 1px solid #e8e8e8;
  padding: 0 12px;
  flex-shrink: 0;
  z-index: 100;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 120px;
}

.header-logo {
  width: 24px;
  height: 24px;
}

.header-title {
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
}

.header-center {
  display: flex;
  align-items: center;
  gap: 2px;
  flex: 1;
  justify-content: center;
}

.header-element-trigger,
.header-element-item {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  color: #444;
  transition: all 0.15s;
  user-select: none;

  &:hover {
    background: #f0f0f0;
    color: #1890ff;
  }

  .anticon { font-size: 14px; }
}

.header-right {
  display: flex;
  align-items: center;
  gap: 2px;
  min-width: 120px;
  justify-content: flex-end;
}

.header-action {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  color: #444;
  transition: all 0.15s;
  user-select: none;

  &:hover {
    background: #f0f0f0;
    color: #1890ff;
  }

  .anticon { font-size: 14px; }
}

/* Element dropdown */
.element-dropdown-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2px;
  padding: 6px;
  min-width: 160px;

  a {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 10px;
    border-radius: 4px;
    cursor: grab;
    text-decoration: none;
    color: #333;
    font-size: 13px;
    transition: all 0.15s;

    &:hover {
      background: #e6f7ff;
      color: #1890ff;
    }

    .anticon { font-size: 15px; }
  }
}

/* ====== TOOLBAR ====== */
.design-toolbar {
  display: flex;
  align-items: center;
  height: 32px;
  background: #fff;
  border-bottom: 1px solid #e8e8e8;
  padding: 0 8px;
  flex-shrink: 0;
  gap: 4px;
}

.toolbar-left,
.toolbar-center,
.toolbar-right {
  display: flex;
  align-items: center;
  gap: 2px;
}

.toolbar-center {
  flex: 1;
  justify-content: center;
}

.tool-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 4px;
  cursor: pointer;
  color: #555;
  transition: all 0.15s;

  &:hover {
    background: #f0f0f0;
    color: #1890ff;
  }

  &.active {
    background: #e6f7ff;
    color: #1890ff;
  }

  &.disabled {
    color: #bbb;
    cursor: default;
    &:hover { background: transparent; color: #bbb; }
  }

  &.danger:hover {
    background: #fff1f0;
    color: #ff4d4f;
  }

  .anticon { font-size: 14px; }
}

.tool-gap {
  display: inline-block;
  width: 1px;
  height: 16px;
  background: #e8e8e8;
  margin: 0 4px;
}

.paper-sizes {
  display: flex;
  align-items: center;
  gap: 2px;
}

.paper-size-btn {
  padding: 2px 8px;
  border-radius: 3px;
  cursor: pointer;
  font-size: 12px;
  color: #555;
  transition: all 0.15s;

  &:hover { background: #f0f0f0; color: #1890ff; }
  &.active { background: #1890ff; color: #fff; }
}

.scale-value {
  font-size: 12px;
  color: #666;
  min-width: 36px;
  text-align: center;
  user-select: none;
}

/* ====== MAIN CONTENT ====== */
.design-main {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* Left Panel */
.left-panel {
  width: 220px;
  background: #fff;
  border-right: 1px solid #e8e8e8;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  overflow: hidden;
}

.panel-header {
  padding: 8px 12px;
  font-size: 13px;
  font-weight: 600;
  color: #333;
  border-bottom: 1px solid #f0f0f0;
  background: #fafafa;
  flex-shrink: 0;
}

.panel-body {
  flex: 1;
  overflow-y: auto;
  padding: 4px 0;
}

.element-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
  padding: 4px;
}

.element-item {
  display: flex;
  align-items: center;
  justify-content: center;
}

.element-item > a {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 8px 4px;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  background: #fafafa;
  cursor: grab;
  text-decoration: none;
  color: #333;
  transition: all 0.2s;

  &:hover {
    border-color: #1890ff;
    background: #e6f7ff;
    color: #1890ff;
  }
  &:active { cursor: grabbing; }
}

.element-icon {
  font-size: 22px;
  margin-bottom: 3px;
  color: #595959;
  .element-item > a:hover & { color: #1890ff; }
}

.element-label {
  font-size: 11px;
  white-space: nowrap;
  color: #666;
}

/* Design Canvas */
.design-canvas {
  flex: 1;
  overflow: auto;
  background: #e8e8e8;
  display: flex;
  justify-content: center;
  padding: 20px;
}

/* Right Panel */
.right-panel {
  width: 260px;
  background: #fff;
  border-left: 1px solid #e8e8e8;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  overflow: hidden;
}

/* Extensions area */
.design-extensions {
  background: #fff;
  border-top: 1px solid #e8e8e8;
  padding: 8px 16px;
  flex-shrink: 0;
}

.ext-label {
  width: 12vw;
  text-align: right;
  white-space: nowrap;
  font-size: 13px;
  color: #666;
}

/* ====== HIPRINT OVERRIDES ====== */
:deep(.ant-collapse-header) {
  padding: 6px 12px !important;
  font-size: 13px !important;
  color: #666 !important;
}

:deep(.ant-collapse-content-box) {
  padding: 4px 6px !important;
}

:deep(.hiprint-printElement-image-content) {
  img { content: url("~@/assets/logo.png"); }
}

:deep(.toplineOfPosition) { border: 0; border-top: 1px dashed purple; }
:deep(.bottomlineOfPosition) { border: 0; border-top: 1px dashed purple; }
:deep(.leftlineOfPosition) { border: 0; border-left: 1px dashed purple; }
:deep(.rightlineOfPosition) { border: 0; border-left: 1px dashed purple; }
</style>