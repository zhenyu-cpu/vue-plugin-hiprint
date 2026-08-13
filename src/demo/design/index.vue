<template>
  <a-card>
    <div style="display: flex;flex-direction: column">
      <a-space style="margin-bottom: 10px">
        <a-button-group>
          <template v-for="(value,type) in paperTypes" :key="type">
            <a-button :type="curPaperType === type ? 'primary' : 'default'" @click="setPaper(type,value)">
              {{ type }}
            </a-button>
          </template>
          <a-popover v-model:open="paperPopVisible" title="设置纸张宽高(mm)" trigger="click">
            <template #content>
              <a-input-group compact style="margin: 10px 10px">
                <a-input type="number" v-model:value="paperWidth" style=" width: 100px; text-align: center"
                         placeholder="宽(mm)"/>
                <a-input style=" width: 30px; border-left: 0; pointer-events: none; backgroundColor: #fff"
                         placeholder="~" disabled
                />
                <a-input type="number" v-model:value="paperHeight" style="width: 100px; text-align: center; border-left: 0"
                         placeholder="高(mm)"/>
              </a-input-group>
              <a-button type="primary" style="width: 100%" @click="otherPaper">确定</a-button>
            </template>
            <a-button :type="'other'==curPaperType?'primary':''">自定义纸张</a-button>
          </a-popover>
        </a-button-group>
        <a-button type="text" @click="changeScale(false)"><template #icon><ZoomOutOutlined /></template></a-button>
        <a-input-number
          :value="scaleValue"
          :min="scaleMin"
          :max="scaleMax"
          :step="0.1"
          disabled
          style="width: 70px;"
          :formatter="value => `${(value * 100).toFixed(0)}%`"
          :parser="value => value.replace('%', '')"
        />
        <a-button type="text" @click="changeScale(true)"><template #icon><ZoomInOutlined /></template></a-button>
        <a-button type="primary" @click="rotatePaper()"><template #icon><RedoOutlined /></template>旋转</a-button>
        <a-button type="primary" @click="preView">
          <template #icon><EyeOutlined /></template>预览
        </a-button>
        <a-popconfirm
          title="是否确认清空?"
          okType="danger"
          okText="确定清空"
          @confirm="clearPaper"
        >
          <template #icon><QuestionCircleOutlined style="color: red"/></template>
          <a-button type="primary" danger>
            清空
            <template #icon><CloseOutlined /></template>
          </a-button>
        </a-popconfirm>
        <json-view :template="template"/>
        <a-dropdown>
          <template #overlay>
            <a-menu @click="handleMenuClick">
              <a-menu-item key="0">都不看,我就不看</a-menu-item>
              <a-menu-item v-for="item in keyList" :key="item.key"> {{ item.name }}</a-menu-item>
            </a-menu>
          </template>
          <a-button style="margin-left: 8px"> 更多功能示例
            <template #icon><DownOutlined /></template>
          </a-button>
        </a-dropdown>
      </a-space>
      <a-space v-if="'1' == curKey" style="margin-bottom: 10px">
        <div class="btn-text-desc">直接打印/api打印:</div>
        <a-button type="primary" @click="print">
          <template #icon><PrinterOutlined /></template>直接打印
        </a-button>
        <a-button type="primary" @click="printByFragments">
          <template #icon><PrinterOutlined /></template>分批直接打印
        </a-button>
        <a-button type="primary" @click="onlyPrint">
          Api单独打印
        </a-button>
        <a-button type="primary" @click="onlyPrint2">
          Api单独直接打印
        </a-button>
      </a-space>
      <a-space v-if="'2' == curKey" style="margin-bottom: 10px">
        <div class="btn-text-desc">导出PDF文件/流:</div>
        <a-button type="primary" @click="exportPdf('')">
          导出获取pdf(Blob)
        </a-button>
        <a-button type="primary" @click="exportPdf('arraybuffer')">
          导出获取pdf(ArrayBuffer)
        </a-button>
        <a-button type="primary" @click="exportPdf('dataurl')">
          导出获取pdf(DataUrl)
        </a-button>
        <a-button type="primary" @click="exportPdf('bloburl')">
          导出获取pdf(BlobUrl)
        </a-button>
        <a-button type="primary" @click="exportPdf('dataurlstring')">
          导出获取pdf(DataUrlString)
        </a-button>
        <a-button type="primary" @click="exportPdf('pdfobjectnewwindow')">
          导出查看pdf(PdfObjectNewWindow)
        </a-button>
      </a-space>
      <a-space v-if="'3' == curKey" style="margin-bottom: 10px">
        <div class="btn-text-desc">ipp打印(需打印机支持):</div>
        <a-button type="primary" @click="ippPrintAttr">
          ipp获取 打印机 参数情况
        </a-button>
        <a-button type="primary" @click="ippPrintTest">
          ipp打印测试
        </a-button>
        <a-button type="primary" @click="ippRequestTest">
          ipp请求 获取 打印机 参数情况
        </a-button>
        <a-button type="primary" @click="ippRequestPrint">
          ipp请求 打印测试
        </a-button>
      </a-space>
      <a-space v-if="'4' == curKey" style="margin-bottom: 10px">
        <div class="btn-text-desc">元素参数操作:</div>
        <a-button type="primary" @click="setOptionConfig(-1)"> 测试隐藏参数[看代码]
        </a-button>
        <a-button type="primary" @click="setOptionConfig(1)"> 隐藏[文本] "边框"、"高级"
        </a-button>
        <a-button type="primary" @click="setOptionConfig(2)"> [图片]不分组
        </a-button>
        <a-button type="primary" @click="setOptionConfig(3)"> 重写[文本] "字体大小"、"元素层级"
        </a-button>
        <a-button type="primary" @click="setOptionConfig(4)"> [文本]新增 "缩放"
        </a-button>
        <a-button type="primary" @click="setOptionConfig(0)"> 还原配置
        </a-button>
      </a-space>
      <a-space v-if="'5' == curKey" style="margin-bottom: 10px">
        <div class="btn-text-desc">模板导入导出:</div>
        <a-textarea style="width:30vw" v-model:value="jsonIn" @pressEnter="updateJson"
                    placeholder="复制json模板到此后 点击右侧更新"
                    allow-clear/>
        <a-button type="primary" @click="updateJson">
          更新json模板
        </a-button>
        <a-button type="primary" @click="exportJson">
          导出json模板到 textArea
        </a-button>
        <a-textarea style="width:30vw" v-model:value="jsonOut" placeholder="点击左侧导出json" allow-clear/>
      </a-space>
      <a-space v-if="'6' == curKey" style="margin-bottom: 10px">
        <div class="btn-text-desc">元素获取/更新参数:</div>
        <a-button type="primary" @click="getSelectEls">
          获取选中元素
        </a-button>
        <a-button type="primary" @click="setEleSelectByField">
          设置根据field选中文本元素
        </a-button>

        <a-button type="primary" @click="updateFontSize">
          选中元素字体12pt
        </a-button>
        <a-button type="primary" @click="updateFontWeight">
          选中元素字体Bolder
        </a-button>
      </a-space>
      <a-space v-if="'7' == curKey" style="margin-bottom: 10px">
        <div class="btn-text-desc">元素对齐/间距(需先选中):</div>
        <a-button type="primary" @click="setElsSpace(true)"> 水平间距10
        </a-button>
        <a-button type="primary" @click="setElsSpace(false)"> 垂直间距10
        </a-button>
        <a-radio-group>
          <a-radio-button @click="setElsAlign('left')" title="左对齐">
            <template #default><AlignLeftOutlined /></template>
          </a-radio-button>
          <a-radio-button @click="setElsAlign('vertical')" title="居中">
            <template #default><AlignCenterOutlined /></template>
          </a-radio-button>
          <a-radio-button @click="setElsAlign('right')" title="右对齐">
            <template #default><AlignRightOutlined /></template>
          </a-radio-button>
          <a-radio-button @click="setElsAlign('top')" title="顶部对齐">
            <template #default><VerticalAlignTopOutlined /></template>
          </a-radio-button>
          <a-radio-button @click="setElsAlign('horizontal')" title="垂直居中">
            <template #default><VerticalAlignMiddleOutlined /></template>
          </a-radio-button>
          <a-radio-button @click="setElsAlign('bottom')" title="底部对齐">
            <template #default><VerticalAlignBottomOutlined /></template>
          </a-radio-button>
          <a-radio-button @click="setElsAlign('distributeHor')" title="横向分散">
            <template #default><ColumnWidthOutlined /></template>
          </a-radio-button>
          <a-radio-button @click="setElsAlign('distributeVer')" title="纵向分散">
            <template #default><ColumnHeightOutlined /></template>
          </a-radio-button>
        </a-radio-group>
      </a-space>
    </div>
    <a-row :gutter="[8,0]">
      <a-col :span="4">
        <div class="element-sidebar">
          <div class="sidebar-header">组件面板</div>
          <div class="sidebar-content hiprintEpContainer rect-printElement-types">
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
      </a-col>
      <a-col :span="15">
        <a-card class="card-design">
          <div id="hiprint-printTemplate" class="hiprint-printTemplate"></div>
        </a-card>
      </a-col>
      <a-col :span="5" class="params_setting_container">
        <a-card>
          <a-row class="hinnn-layout-sider">
            <div id="PrintElementOptionSetting"></div>
          </a-row>
        </a-card>
      </a-col>
    </a-row>
    <!-- 预览 -->
    <print-preview ref="preView"/>
  </a-card>
</template>

<script defer>
// import {defaultElementTypeProvider, hiprint} from '../../index'
import * as vuePluginHiprint from '../../index'
// import panel from './panel'
import printData from './print-data'
import printPreview from './preview'
import jsonView from "../json-view.vue";
import fontSize from "./font-size.js";
import scale from "./scale.js";
import {decodeVer} from '@/utils'
import {
  ZoomOutOutlined, ZoomInOutlined, RedoOutlined, EyeOutlined,
  PrinterOutlined, QuestionCircleOutlined, CloseOutlined, DownOutlined,
  SaveOutlined, FontSizeOutlined, PictureOutlined, ProfileOutlined,
  TableOutlined, CodeOutlined, EditOutlined,
  MinusOutlined, VerticalAlignMiddleOutlined, BorderOutlined,
  ApartmentOutlined, BarcodeOutlined, QrcodeOutlined,
  AlignLeftOutlined, AlignCenterOutlined, AlignRightOutlined,
  VerticalAlignTopOutlined, VerticalAlignBottomOutlined,
  ColumnWidthOutlined, ColumnHeightOutlined,
  AppstoreOutlined
} from "@ant-design/icons-vue";
// disAutoConnect();
var hiprint, defaultElementTypeProvider, panel;
let hiprintTemplate;

export default {
  name: "printDesign",
  components: {printPreview, jsonView, ZoomOutOutlined, ZoomInOutlined, RedoOutlined, EyeOutlined, PrinterOutlined, QuestionCircleOutlined, CloseOutlined, DownOutlined, SaveOutlined, FontSizeOutlined, PictureOutlined, ProfileOutlined, TableOutlined, AppstoreOutlined, CodeOutlined, EditOutlined, MinusOutlined, VerticalAlignMiddleOutlined, BorderOutlined, ApartmentOutlined, BarcodeOutlined, QrcodeOutlined, AlignLeftOutlined, AlignCenterOutlined, AlignRightOutlined, VerticalAlignTopOutlined, VerticalAlignBottomOutlined, ColumnWidthOutlined, ColumnHeightOutlined},
  data() {
    return {
      activeCollapse: ['basic'],
      template: null,
      curPaper: {
        type: 'A4',
        width: 210,
        height: 296.6
      },
      paperTypes: {
        'A3': {
          width: 420,
          height: 296.6
        },
        'A4': {
          width: 210,
          height: 296.6
        },
        'A5': {
          width: 210,
          height: 147.6
        },
        'B3': {
          width: 500,
          height: 352.6
        },
        'B4': {
          width: 250,
          height: 352.6
        },
        'B5': {
          width: 250,
          height: 175.6
        }
      },
      // 自定义纸张
      paperPopVisible: false,
      paperWidth: '220',
      paperHeight: '80',
      // 缩放
      scaleValue: 1,
      scaleMax: 5,
      scaleMin: 0.5,
      // 导入导出json
      jsonIn: '',
      jsonOut: '',
      // 功能
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
        if (item.width === width && item.height === height) {
          type = key
        }
      }
      return type
    },
    /**
     * @description: 当前版本信息，用于 demo 页面根据版本控制功能
     * @return {Object}
     */
    currVerInfo() {
      if (this.$parent.version && this.$parent.version != "development") {
        return decodeVer(this.$parent.version)
      } else if (hiprint?.version) {
        return decodeVer(hiprint.version)
      } else {
        return {
          verVal: 9999
        }
      }
    }
  },
  mounted() {
    this.getPanel()
    // 存在一个固定版本号，并且不是开发版本
    if (this.$parent.version && this.$parent.version != "development") {
      // 加载对应版本的 hiprint
      this.getVersion(this.$parent.version)
    }
    // 不存在固定版本，加载当前代码中的 hiprint
    else {
      hiprint = vuePluginHiprint.hiprint
      defaultElementTypeProvider = vuePluginHiprint.defaultElementTypeProvider
      this.init()
    }
  },
  methods: {
    /**
     * @description: 加载 panel
     */
    getPanel() {
      // 加载所有 panel
      const panelModules = import.meta.glob('./panel*.js', { eager: true })
      // 对所有 panel 进行版本解析
      var panelInfos = Object.keys(panelModules).map(key => ({
        ...decodeVer(key.replace(/(\.\/panel-?)|(\.js)/g, '')),
        key
      }))
      // 存在一个固定版本号，并且不是开发版本
      if (this.$parent.version && this.$parent.version != "development") {
        // 解析对应版本信息
        var currVerInfo = decodeVer(this.$parent.version)
        // 查找小于等于当前版本的 panel
        var newVers = panelInfos.filter(({verVal}) => verVal <= currVerInfo.verVal)
          // 对版本号进行倒叙
          .sort((acc, curr) => curr.verVal - acc.verVal)
        // 获取最大版本号面板 json
        panel = panelModules[newVers[0].key].default
      }
      // 不存在固定版本，加载默认面板 json
      else {
        panel = panelModules['./panel.js'].default
      }
    },
    /**
     * @description: 加载版本
     * @param {string} version 版本号
     */
    getVersion(version) {
      const script = document.createElement("script");
      script.setAttribute("type", "text/javascript");
      script.setAttribute(
        "src",
        // jsdelivr cdn
        // `https://cdn.jsdelivr.net/npm/vue-plugin-hiprint@${version}/dist/vue-plugin-hiprint.js`
        // cnpm cdn
        // `https://registry.npmmirror.com/vue-plugin-hiprint/${version}/files/dist/vue-plugin-hiprint.js`
        // unpkg cdn
        `https://unpkg.com/vue-plugin-hiprint@${version}/dist/vue-plugin-hiprint.js`
      );
      script.addEventListener("load", () => {
        hiprint = window['vue-plugin-hiprint'].hiprint
        defaultElementTypeProvider = window['vue-plugin-hiprint'].defaultElementTypeProvider
        this.init()
      })
      const head = document.querySelector("head");
      head.querySelector('link[media=print][href*="print-lock.css"]').remove();
      head.append(
        // $(`<link rel="stylesheet" type="text/css" media="print" href="https://registry.npmmirror.com/vue-plugin-hiprint/${version}/files/dist/print-lock.css">`)[0]
        $(`<link rel="stylesheet" type="text/css" media="print" href="https://unpkg.com/vue-plugin-hiprint@${version}/dist/print-lock.css">`)[0]
      )
      head.append(script)
    },
    init() {
      hiprint.init({
        providers: [new defaultElementTypeProvider()],
        lang: this.$parent.lang
      });
      // 还原配置
      hiprint.setConfig()
      // eslint-disable-next-line no-undef
      hiprint.PrintElementTypeManager.buildByHtml($('.ep-draggable-item'));
      $('#hiprint-printTemplate').empty()
      let that = this;
      this.template = hiprintTemplate = new hiprint.PrintTemplate({
        template: panel,
        // 图片选择功能
        onImageChooseClick: (target) => {
          // 测试 3秒后修改图片地址值
          setTimeout(() => {
            // target.refresh(url,options,callback)
            // callback(el, width, height) // 原元素,宽,高
            // target.refresh(url,false,(el,width,height)=>{
            //   el.options.width = width;
            //   el.designTarget.css('width', width + "pt");
            //   el.designTarget.children('.resize-panel').trigger($.Event('click'));
            // })
            target.refresh("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAtAAAAIIAQMAAAB99EudAAAABlBMVEUmf8vG2O41LStnAAABD0lEQVR42u3XQQqCQBSAYcWFS4/QUTpaHa2jdISWLUJjjMpclJoPGvq+1WsYfiJCZ4oCAAAAAAAAAAAAAAAAAHin6pL9c6H/fOzHbRrP0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0u/SY9LS0tLS0tLS0tLS0n+edm+UlpaWlpaWlpaWlpaW/tl0Ndyzbno7/+tPTJdd1wal69dNa6abx+Lq6TSeYtK7BX/Diek0XULSZZrakPRtV0i6Hu/KIt30q4fM0pvBqvR9mvsQkZaW9gyJT+f5lsnzjR54xAk8mAUeJyMPwYFH98ALx5Jr0kRLLndT7b64UX9QR/0eAAAAAAAAAAAAAAAAAAD/4gpryzr/bja4QgAAAABJRU5ErkJggg==", {
              // auto: true, // 根据图片宽高自动等比(宽>高?width:height)
              // width: true, // 按宽调整高
              // height: true, // 按高调整宽
              real: true // 根据图片实际尺寸调整(转pt)
            })
          }, 3000)
          // target.getValue()
          // target.refresh(url)
        },
        // 自定义可选字体
        // 或者使用 hiprintTemplate.setFontList([])
        // 或元素中 options.fontList: []
        fontList: [
          {title: '微软雅黑', value: 'Microsoft YaHei'},
          {title: '黑体', value: 'STHeitiSC-Light'},
          {title: '思源黑体', value: 'SourceHanSansCN-Normal'},
          {title: '王羲之书法体', value: '王羲之书法体'},
          {title: '宋体', value: 'SimSun'},
          {title: '华为楷体', value: 'STKaiti'},
          {title: 'cursive', value: 'cursive'},
        ],
        dataMode: 1, // 1:getJson 其他：getJsonTid 默认1
        history: true, // 是否需要 撤销重做功能
        willOutOfBounds: true, // 是否允许组件内的控件超出范围
        qtDesigner: true, // 是否开启类似QT Designer的唯一field生成模式
        onDataChanged: (type, json) => {
          console.log(type); // 新增、移动、删除、修改(参数调整)、大小、旋转
          console.log(json); // 返回 template
        },
        onUpdateError: (e) => {
          console.log(e);
        },
        settingContainer: '#PrintElementOptionSetting',
        paginationContainer: '.hiprint-printPagination'
      });
      hiprintTemplate.design('#hiprint-printTemplate', {grid: true});
      console.log(hiprintTemplate);
      // 获取当前放大比例, 当zoom时传true 才会有
      this.scaleValue = hiprintTemplate.editingPanel.scale || 1;
    },
    setOptionConfig(type) {
      switch (type) {
        case -1: // 测试
          hiprint.setConfig({
            movingDistance: 2.5,
            text: {
              tabs: [
                // 隐藏部分
                {
                  // name: '测试', // tab名称 可忽略
                  options: [
                    {
                      name: 'fixed',
                      hidden: true
                    },
                  ]
                },
                // 当修改第二个 tabs 时,必须把他之前的 tabs 都列举出来.
              ],
              supportOptions: [
                {
                  name: 'styler',
                  hidden: true
                },
                {
                  name: 'formatter',
                  hidden: true
                },
              ]
            },
            image: {
              tabs: [
                {
                  // 整体替换
                  replace: true,
                  name: '基本', options: [
                    {
                      name: 'field',
                      hidden: false
                    },
                    {
                      name: 'src',
                      hidden: false
                    },
                    {
                      name: 'fit',
                      hidden: false
                    }
                  ]
                },
              ],
            }
          })
          hiprint.setConfig({
            movingDistance: 2.5,
            text: {
              tabs: [
                // 隐藏部分
                {
                  // name: '测试', // tab名称 可忽略
                  options: [
                    {
                      name: 'fixed',
                      hidden: true
                    },
                  ]
                },
                // 当修改第二个 tabs 时,必须把他之前的 tabs 都列举出来.
              ],
              supportOptions: [
                {
                  name: 'styler',
                  hidden: true
                },
                {
                  name: 'formatter',
                  hidden: true
                },
              ]
            },
            image: {
              tabs: [
                {
                  // 整体替换
                  replace: true,
                  name: '基本', options: [
                    {
                      name: 'field',
                      hidden: false
                    },
                    {
                      name: 'src',
                      hidden: false
                    },
                    {
                      name: 'fit',
                      hidden: false
                    }
                  ]
                },
              ],
            }
          })
          break;
        case 0: // 还原配置
          hiprint.setConfig();
          break;
        case 1: // 隐藏文本 边框、高级
          hiprint.setConfig({
            text: {
              tabs: [
                {},
                {},
                // 隐藏边框
                {
                  name: '边框',
                  replace: true, // 整体替换
                  options: []
                },
                // 隐藏高级
                {
                  name: '高级',
                  replace: true, // 整体替换
                  options: []
                },
              ],
            }
          });
          break
        case 2: // 图片元素 参数不分组
          hiprint.setConfig({
            image: {
              tabs: [],
              supportOptions: [],
            }
          });
          break;
        case 3: // 重写字体大小、元素层级参数
          hiprint.setConfig({
            optionItems: [
              fontSize,
              function () {
                function t() {
                  this.name = "zIndex";
                }

                return t.prototype.css = function (t, e) {
                  if (t && t.length) {
                    if (e) return t.css('z-index', e);
                  }
                  return null;
                }, t.prototype.createTarget = function () {
                  return this.target = $('<div class="hiprint-option-item">\n        <div class="hiprint-option-item-label">\n        元素层级2\n        </div>\n        <div class="hiprint-option-item-field">\n        <input type="number" class="auto-submit"/>\n        </div>\n    </div>'), this.target;
                }, t.prototype.getValue = function () {
                  var t = this.target.find("input").val();
                  if (t) return parseInt(t.toString());
                }, t.prototype.setValue = function (t) {
                  this.target.find("input").val(t);
                }, t.prototype.destroy = function () {
                  this.target.remove();
                }, t;
              }(),
            ]
          });
          break;
        case 4: // 新增缩放参数
          hiprint.setConfig({
            optionItems: [
              scale,
            ],
            movingDistance: 2.5,
            text: {
              tabs: [
                {},
                // 当修改第二个 tabs 时,必须把他之前的 tabs 都列举出来.
                {
                  name: '样式', options: [
                    {
                      name: 'scale',
                      after: 'transform', // 自定义参数，插入在 transform 之后
                      hidden: false
                    },
                  ]
                }
              ],
            }
          });
          break;
      }
      // 参数 tabs 会缓存. 这里演示: 手动清空一下, 再点击选中元素
      console.log(hiprintTemplate);
      hiprintTemplate.editingPanel.printElements.forEach((e) => {
        if (e._printElementOptionTabs) {
          delete e._printElementOptionTabs;
        }
        if (e._printElementOptionItems) {
          delete e._printElementOptionItems;
        }
      });
      let els = hiprintTemplate.getSelectEls();
      els && els.length && els[0].designTarget.trigger($.Event('click'));
    },
    /**
     * 设置纸张大小
     * @param type [A3, A4, A5, B3, B4, B5, other]
     * @param value {width,height} mm
     */
    setPaper(type, value) {
      try {
        if (Object.keys(this.paperTypes).includes(type)) {
          this.curPaper = {type: type, width: value.width, height: value.height}
          hiprintTemplate.setPaper(value.width, value.height)
        } else {
          this.curPaper = {type: 'other', width: value.width, height: value.height}
          hiprintTemplate.setPaper(value.width, value.height)
        }
      } catch (error) {
        this.$message.error(`操作失败: ${error}`)
      }
    },
    otherPaper() {
      let value = {}
      value.width = this.paperWidth
      value.height = this.paperHeight
      this.paperPopVisible = false
      this.setPaper('other', value)
    },
    changeScale(big) {
      let scaleValue = this.scaleValue;
      if (big) {
        scaleValue += 0.1;
        if (scaleValue > this.scaleMax) scaleValue = 5;
      } else {
        scaleValue -= 0.1;
        if (scaleValue < this.scaleMin) scaleValue = 0.5;
      }
      if (hiprintTemplate) {
        // scaleValue: 放大缩小值, false: 不保存(不传也一样), 如果传 true, 打印时也会放大
        hiprintTemplate.zoom(scaleValue);
        this.scaleValue = scaleValue;
      }
    },
    rotatePaper() {
      if (hiprintTemplate) {
        hiprintTemplate.rotatePaper()
      }
    },
    preView() {
      // 测试, 点预览更新拖拽元素
      hiprint.updateElementType('defaultModule.text', (type) => {
        type.title = '这是更新后的元素';
        return type
      })
      // 测试, 通过socket刷新打印机列表； 默认只有连接的时候才会获取到最新的打印机列表
      hiprint.refreshPrinterList((list) => {
        console.log('refreshPrinterList')
        console.log(list)
      });
      // 测试, 获取IP、IPV6、MAC地址、DNS
      // 参数格式：
      // 1. 类型（ip、ipv6、mac、dns、all、interface、vboxnet）
      // 2. 回调 data => {addr, e}  addr: 返回的数据 e:错误信息
      // 3. 其他参数 ...args
      hiprint.getAddress('ip', (data) => {
        console.log('ip')
        console.log(data)
      })
      hiprint.getAddress('ipv6', (data) => {
        console.log('ipv6')
        console.log(data)
      })
      hiprint.getAddress('mac', (data) => {
        console.log('mac')
        console.log(data)
      })
      hiprint.getAddress('dns', (data) => {
        console.log('dns')
        console.log(data)
      })
      hiprint.getAddress('all', (data) => {
        console.log('all')
        console.log(data)
      })
      // 各个平台不一样, 用法见: https://www.npmjs.com/package/address
      hiprint.getAddress('interface', (data) => {
        console.log('interface')
        console.log(data)
      }, 'IPv4', 'eth1')
      this.$refs.preView.show(hiprintTemplate, printData)
    },
    onlyPrint() {
      let hiprintTemplate = this.$print(undefined, panel, printData, {}, {
        styleHandler: () => {
          let css = '<link href="http://hiprint.io/Content/hiprint/css/print-lock.css" media="print" rel="stylesheet">';
          return css
        }
      })
      console.log(hiprintTemplate);
    },
    onlyPrint2() {
      let that = this;
      if (window.hiwebSocket.opened) {
        let hiprintTemplate = this.$print2(undefined, panel, printData, {
          printer: '', title: 'Api单独打印',
          styleHandler: () => {
            // let css = '<link href="http://hiprint.io/Content/hiprint/css/print-lock.css" media="print" rel="stylesheet">';
            let css = '<style>.hiprint-printElement-text{color:red !important;}</style>'
            return css
          }
        })
        let key = 'Api单独直接打印';
        hiprintTemplate.on('printSuccess', function () {
          that.$notification.success({
            key: key,
            placement: 'topRight',
            message: key + ' 打印成功',
            description: 'Api单独直接打印回调',
          });
        });
        return;
      }
      this.$error({
        title: "客户端未连接",
        content: '连接【' + hiwebSocket.host + '】失败！请确保目标服务器已下载并运行打印服务！',
      });
    },
    handleMenuClick(e) {
      const {key} = e;
      this.curKey = key;
    },
    print() {
      this.doOperationWhenClientConnected(() => {
        const printerList = hiprintTemplate.getPrinterList();
        console.log(printerList)
        hiprintTemplate.print2(printData, {printer: '', title: 'hiprint测试打印'});
      })
    },
    printByFragments() {
      this.doOperationWhenClientConnected(() => {
        const dataList = new Array(50).fill(printData)
        // 原有方法打印不成功，原因是获取HTML的方法处理时间过长，导致超过socket心跳间隔
        // hiprintTemplate.print2(dataList, {printer: '', title: 'hiprint测试打印'});
        hiprintTemplate.print2(dataList, {
          printer: '',
          title: 'hiprint测试打印',
          printByFragments: true,   // 是否需要分批打印，分批打印能够支持连续打印大量数据，但会增加打印所需时间
          // generateHTMLInterval: 30, // 多条数据生成HTML的间隔，单位ms，默认是10
          // fragmentSize: 10000,  // 分片字符长度，默认50000
          // sendInterval: 20, // 分片传输间隔，单位ms，默认10
          // type: 'pdf',
        });
      })
    },
    doOperationWhenClientConnected(operation) {
      if (window.hiwebSocket.opened) {
        operation?.()
        return
      }
      this.$error({
        title: "客户端未连接",
        content: '连接【' + hiwebSocket.host + '】失败！请确保目标服务器已下载并运行打印服务！',
      });
    },
    clearPaper() {
      try {
        hiprintTemplate.clear();
      } catch (error) {
        this.$message.error(`操作失败: ${error}`);
      }
    },
    exportPdf(type) {
      hiprintTemplate.toPdf(printData, '测试导出pdf', {isDownload: false, type: type}).then((res) => {
        console.log('type:', type);
        console.log(res);
      });
    },
    ippPrintAttr() {
      // 不知道打印机 ipp 情况， 可通过 '客户端' 获取一下
      const printerList = hiprintTemplate.getPrinterList();
      console.log(printerList)
      if (!printerList.length) return;
      let p = printerList[0];
      console.log(p)
      // 系统不同， 参数可能不同
      let url = p.options['printer-uri-supported'];
      // 测试 获取 ipp打印 支持参数
      hiprint.ippPrint({
        url: url,
        // 打印机参数： {version,uri,charset,language}
        opt: {},
        action: 'Get-Printer-Attributes', // 获取打印机支持参数
        // ipp参数
        message: null,
      }, (res) => {
        // 执行的ipp 任务回调 / 错误回调
        console.log(res)
      }, (printer) => {
        // ipp连接成功 回调 打印机信息
        console.log(printer)
      })
    },
    ippPrintTest() {
      // 不知道打印机 ipp 情况， 可通过 '客户端' 获取一下
      const printerList = hiprintTemplate.getPrinterList();
      console.log(printerList)
      if (!printerList.length) return;
      let p = printerList[0];
      console.log(p)
      // 系统不同， 参数可能不同
      let url = p.options['printer-uri-supported'];
      // 测试 打印文本
      hiprint.ippPrint({
        url: url,
        // 打印机参数： {version,uri,charset,language}
        opt: {},
        action: 'Print-Job',
        // ipp参数
        message: {
          "operation-attributes-tag": {
            "requesting-user-name": "hiPrint", // 用户名
            "job-name": "ipp Test Job", // 任务名
            "document-format": "text/plain" // 文档类型
          },
          // data 需为 Buffer (客户端简单处理了string 转 Buffer), 支持设置 encoding
          // data 需为 Buffer (客户端简单处理了string 转 Buffer), 支持设置 encoding
          // data 需为 Buffer (客户端简单处理了string 转 Buffer), 支持设置 encoding
          // 其他 Uint8Array/ArrayBuffer   默认仅 使用 Buffer.from(data)
          // 其他 Uint8Array/ArrayBuffer   默认仅 使用 Buffer.from(data)
          // 其他 Uint8Array/ArrayBuffer   默认仅 使用 Buffer.from(data)
          // 其他 Uint8Array/ArrayBuffer   默认仅 使用 Buffer.from(data)
          data: 'test test test test test test test',
          encoding: 'utf-8' // 默认可不传
        }
      }, (res) => {
        // 执行的ipp 任务回调 / 错误回调
        console.log(res)
      }, (printer) => {
        // ipp连接成功 回调 打印机信息
        console.log(printer)
      })
    },
    // 自定义 ipp 请求
    ippRequestTest() {
      const printerList = hiprintTemplate.getPrinterList();
      console.log(printerList)
      if (!printerList.length) return;
      let p = printerList[0];
      console.log(p)
      // 系统不同， 参数可能不同
      let url = p.options['printer-uri-supported'];
      // 详见： https://www.npmjs.com/package/ipp
      hiprint.ippRequest({
        url: url,
        // 传入的数据 ipp.serialize 后 未做任何处理  打印内容 需要 Buffer
        // 传入的数据 ipp.serialize 后 未做任何处理  打印内容 需要 Buffer
        // 传入的数据 ipp.serialize 后 未做任何处理  打印内容 需要 Buffer
        data: {
          "operation": "Get-Printer-Attributes",
          "operation-attributes-tag": {
            // 测试发现 Request下列3个必须要有
            "attributes-charset": "utf-8",
            "attributes-natural-language": "zh-cn",
            "printer-uri": url
          }
        }
      }, (res) => {
        // 执行的ipp 任务回调 / 错误回调
        console.log(res)
      })
    },
    ippRequestPrint() {
      const printerList = hiprintTemplate.getPrinterList();
      console.log(printerList)
      if (!printerList.length) return;
      let p = printerList[0];
      console.log(p)
      // 系统不同， 参数可能不同
      let url = p.options['printer-uri-supported'];
      let str = "ippRequestPrint ippRequestPrint ippRequestPrint";
      let array = new Uint8Array(str.length);
      for (var i = 0; i < str.length; i++) {
        array[i] = str.charCodeAt(i);
      }
      let testData = array.buffer;
      // 详见： https://www.npmjs.com/package/ipp
      hiprint.ippRequest({
        url: url,
        // 传入的数据 ipp.serialize 后 未做任何处理  打印内容 需要 Buffer
        // 传入的数据 ipp.serialize 后 未做任何处理  打印内容 需要 Buffer
        // 传入的数据 ipp.serialize 后 未做任何处理  打印内容 需要 Buffer
        data: {
          "operation": "Print-Job",
          "operation-attributes-tag": {
            // 测试发现 Request下列3个必须要有
            "attributes-charset": "utf-8",
            "attributes-natural-language": "zh-cn",
            "printer-uri": url,
            "requesting-user-name": "hiPrint", // 用户名
            "job-name": "ipp Request Job", // 任务名
            "document-format": "text/plain" // 文档类型
          },
          data: testData
        }
      }, (res) => {
        // 执行的ipp 任务回调 / 错误回调
        console.log(res)
      })
    },
    updateJson() {
      if (hiprintTemplate) {
        try {
          hiprintTemplate.update(JSON.parse(this.jsonIn))
        } catch (e) {
          this.$message.error(`更新失败: ${e}`)
        }
      }
    },
    exportJson() {
      if (hiprintTemplate) {
        this.jsonOut = JSON.stringify(hiprintTemplate.getJson() || {})
      }
    },
    setElsAlign(e) {
      hiprintTemplate.setElsAlign(e)
    },
    setElsSpace(h) {
      hiprintTemplate.setElsSpace(10, h)
    },
    setEleSelectByField() {
      hiprintTemplate.selectElementsByField(['name'])
    },
    getSelectEls() {
      let els = hiprintTemplate.getSelectEls();
      console.log(els)
    },
    updateFontSize() {
      hiprintTemplate.updateOption('fontSize', 12);
    },
    updateFontWeight() {
      hiprintTemplate.updateOption('fontWeight', 'bolder');
    }
  }
}
</script>

<style lang="less" scoped>

.btn-text-desc {
  width: 12vw;
  text-align: right;
  white-space: nowrap;
}

// 组件面板侧边栏
.element-sidebar {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #fff;
  border-right: 1px solid #f0f0f0;
}

.sidebar-header {
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
  border-bottom: 1px solid #f0f0f0;
  background: #fafafa;
}

.sidebar-content {
  flex: 1;
  overflow-y: auto;
  padding: 4px 0;
}

.element-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
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
  padding: 10px 4px;
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

  &:active {
    cursor: grabbing;
  }
}

.element-icon {
  font-size: 24px;
  margin-bottom: 4px;
  color: #595959;

  .element-item > a:hover & {
    color: #1890ff;
  }
}

.element-label {
  font-size: 12px;
  white-space: nowrap;
  color: #666;
}

:deep(.ant-collapse-header) {
  padding: 8px 16px !important;
  font-size: 13px !important;
  color: #666 !important;
}

:deep(.ant-collapse-content-box) {
  padding: 4px 8px !important;
}

// 默认图片
:deep( .hiprint-printElement-image-content) {
  img {
    content: url("~@/assets/logo.png");
  }
}

// 辅助线样式
:deep( .toplineOfPosition) {
  border: 0;
  border-top: 1px dashed purple;
}

:deep( .bottomlineOfPosition) {
  border: 0;
  border-top: 1px dashed purple;
}

:deep( .leftlineOfPosition) {
  border: 0;
  border-left: 1px dashed purple;
}

:deep( .rightlineOfPosition) {
  border: 0;
  border-left: 1px dashed purple;
}

// 设计容器
.card-design {
  overflow: hidden;
  overflow-x: auto;
  overflow-y: auto;
}

</style>
