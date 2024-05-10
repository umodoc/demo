<template>
  <div class="demo-container">
    <header class="header-container">
      <a class="logo" href="https://docs.umodoc.com">
        <img src="/logo.svg" alt="Umo Editor" />
        | <span>Umo Editor 在线示例</span>
      </a>
      <div class="title">{{ options.document.title }}</div>
      <div class="actions">
        <a
          class="github"
          href="https://github.com/umodoc/editor"
          target="_blank"
        >
          <img
            src="https://img.shields.io/github/stars/umodoc/editor?style=social"
            height="22"
          />
        </a>
        <a class="home" href="https://umodoc.com">
          <img src="/home.svg" height="18" />
          返回官网
        </a>
        <a :class="{ expand: showPane }" @click="showPane = !showPane">
          <img src="/expand.svg" height="18" />
          {{ showPane ? '收起' : '打开' }}设置面板
        </a>
      </div>
    </header>
    <div class="body-container">
      <main class="editor-container">
        <umo-editor
          v-if="showEditor"
          ref="editorRef"
          v-bind="options"
          @before-create="onBeforeCreate"
          @created="onCreated"
          @changed="onChanged"
          @changed:selection="onChangedSelection"
          @changed:transaction="onChangedTransaction"
          @changed:menu="onChangedMenu"
          @changed:toolbar="onChangedToolbar"
          @changed:page-size="onChangedPageSize"
          @changed:page-orientation="onChangedPageOrientation"
          @changed:page-margin="onChangedPageMargin"
          @changed:page-background="onChangedPageBackground"
          @changed:page-zoom="onChangedZoom"
          @changed:page-show-toc="onChangedPageShowToc"
          @changed:page-preview="onChangedpreview"
          @changed:page-watermark="onChangedPageWatermark"
          @focus="onFocus"
          @blur="onBlur"
          @saved="onSaved"
          @destroy="onDestroy"
        />
      </main>
      <aside v-if="showPane" class="config-panel"></aside>
    </div>
  </div>
</template>

<script setup>
import { nextTick, watch, onMounted, ref } from 'vue'
import { UmoEditor } from '@umodoc/editor'
import { Pane } from 'tweakpane'
import { useClipboard } from '@vueuse/core'

let defaultOptions = {}
const editorRef = ref(null)
const options = ref({
  editorKey: 'demo',
  cdnUrl: 'https://cdn.umodoc.com',
  document: {
    content: localStorage.getItem('umo-editor-demo-content'),
  },
  templates: [
    {
      title: '工作任务',
      description: '工作任务模板',
      content: '<p>工作任务模板</p>',
    },
    {
      title: '工作周报',
      description: '工作周报模板',
      content: '<p>工作周报模板</p>',
    },
  ],
  onSave(content, page, document) {
    localStorage.setItem('umo-editor-demo-content', document.content)
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const success = true
        if (success) {
          useLogger(
            'saveContent',
            '文档已保存，可用参数: { content, page, document }',
          )
          resolve(true)
        } else {
          reject('操作失败')
        }
      }, 2000)
    })
  },
})
const themeVars = {
  // 主题色
  '--umo-primary-color': '#015beb',
  '--umo-color-white': '#fff',
  '--umo-color-black': '#000',
  // 警示颜色
  '--umo-warning-color': '#f6913e',
  '--umo-error-color': '#ef3f35',
  // 背景颜色
  '--umo-container-background': '#f4f5f7',
  '--umo-button-hover-background': '#f1f3f5',
  // 字体相关
  '--umo-font-family':
    'helvetica neue, helvetica, pingfang sc, hiragino sans gb, microsoft yahei, simsun, sans-serif',
  '--umo-font-size': '14px',
  '--umo-font-size-small': '12px',
  '--umo-text-color': 'rgb(51, 54, 57)',
  '--umo-text-color-light': 'rgba(0, 0, 0, 0.5)',
  '--umo-text-color-disabled': '#a7abac',
  // 边框
  '--umo-border-color': 'rgba(0, 0, 0, 0.08)',
  '--umo-border-color-dark': '#ddd',
  '--umo-border-color-light': 'rgba(0, 0, 0, .05)',
  '--umo-shadow':
    '0 3px 14px 2px rgba(0, 0, 0, 0.03), 0 8px 10px 1px rgba(0, 0, 0, 4%), 0 5px 5px -3px rgba(0, 0, 0, 8%)',
  // 圆角
  '--umo-radius': '3px',
  '--umo-radius-medium': '5px',
  // 弹出层
  '--umo-popup-content-padding': '12px',
  '--umo-popup-max-height': 'max(60vh, 180px)',
  '--umo-tooltip-content-padding': '6px 10px',
  '--umo-mask-color': 'transparent',
  // 编辑器
  '--umo-content-placeholder-color': '#999',
  '--umo-content-node-border': '#e7e7e7',
  '--umo-content-node-radius': 'var(--umo-radius)',
  '--umo-content-node-bottom': '0.75em',
  '--umo-content-node-selected-background': '#f9fbfd',
  '--umo-content-table-border-color': '#333',
  '--umo-content-table-thead-background': '#f1f3f5',
  '--umo-content-table-selected-background': 'rgba(200, 200, 255, 0.4)',
  '--umo-content-line-number-color': '#e7e8ea',
  '--umo-content-search-result-background': '#fefc7ef2',
  '--umo-content-search-result-current-background': '#0dff00c3',
  '--umo-content-invisible-break-color': 'rgb(78, 139, 252)',
  '--umo-content-code-color': 'var(--umo-primary-color)',
  '--umo-content-code-background': '#f1f3f5',
  '--umo-content-code-family':
    'Consolas, Monaco, Andale Mono, Ubuntu Mono,monospace',
  // 滚动条
  '--umo-scrollbar-size': '4px',
  '--umo-scrollbar-thumb-color': 'rgba(0, 0, 0, 0.2)',
  '--umo-scrollbar-thumb-hover-color': 'rgba(0, 0, 0, 0.35)',
}
const getThemeCSS = () => {
  const cssVars = Object.entries(themeVars)
    .map(([key, value]) => `${key}: ${value};`)
    .join('\n')
  return `.umo-editor-container{\n${cssVars}\n}`
}

const showEditor = ref(true)
const resetEditor = async () => {
  showEditor.value = false
  await nextTick()
  showEditor.value = true
}

const useLogger = (eventName, ...content) => {
  const time = new Date().toLocaleTimeString()
  console.info(
    `%cUmo Editor%c${time} %c[${eventName}]`,
    `background: #015beb;
    color: #fff;
    border-radius: 2px;
    padding: 2px 5px;
    margin-right: 6px;`,
    `color: rgba(0,0,0,.5)`,
    `color: #069f69;
    font-weight: bold`,
    ...content,
  )
}
const useMessage = (content, type = 'info') => {
  editorRef.value.useMessage(type, {
    attach: 'body',
    content,
  })
}
const useAlert = (content, title = '信息提示', theme = 'info') => {
  const dialog = editorRef.value.useAlert({
    attach: 'body',
    theme,
    header: title,
    body: content,
    onConfirm() {
      dialog.destroy()
    },
  })
}

// 编辑器事件
const onBeforeCreate = () => {
  useLogger('onBeforeCreate', '编辑器即将创建，无可用参数')
}
const onCreated = () => {
  useLogger('onCreated', '编辑器已创建，可用参数: { editor }')
}
const onChanged = () => {
  const content = editorRef.value.getContent()
  useLogger('onChanged', '编辑器内容已更新，可用参数: { editor }')
  localStorage.setItem('umo-editor-demo-content', content)
}
const onChangedSelection = () => {
  useLogger('onChanged:selection', '所选内容已发生变化，可用参数: { editor }')
}
const onChangedTransaction = () => {
  useLogger(
    'onChanged:transaction',
    '编辑器状态已发生变化，可用参数: { editor, transaction }',
  )
}
const onChangedMenu = (currentMenu) => {
  useLogger(
    'onChanged:menu',
    `菜单栏状态发生变化，可用参数: currentMenu，当前菜单为: ${currentMenu}`,
  )
}
const onChangedToolbar = ({ toolbar, oldToolbar }) => {
  useLogger(
    'onChanged:toolbar',
    '工具栏信息发生变化，可用参数: { toolbar, oldToolbar }，当前工具栏信息为:',
    toolbar,
    '之前工具栏信息为：',
    oldToolbar,
  )
}
const onChangedPageSize = ({ pageSize, oldPageSize }) => {
  useLogger(
    'onChanged:pageSize',
    '页面大小信息发生变化，可用参数: { pageSize, oldPageSize }，当前页面大小信息为:',
    pageSize,
    '之前页面大小信息为:',
    oldPageSize,
  )
}
const onChangedPageOrientation = ({ pageOrientation, oldPageOrientation }) => {
  useLogger(
    'onChanged:pageOrientation',
    `页面方向发生变化，可用参数: { pageOrientation, oldPageOrientation }，当前页面方向为: ${pageOrientation}，之前页面方向为: ${oldPageOrientation}`,
  )
}
const onChangedPageMargin = ({ pageMargin, oldPageMargin }) => {
  useLogger(
    'onChanged:pageMargin',
    '页面边距信息发生变化，可用参数: { pageMargin, oldPageMargin }，当前页面边距信息为:',
    pageMargin,
    '之前页面边距信息为:',
    oldPageMargin,
  )
}
const onChangedPageBackground = ({ pageBackground, oldPageBackground }) => {
  useLogger(
    'onChanged:pageBackground',
    `页面背景发生变化，可用参数: { pageBackground, oldPageBackground }，当前页面背景为: ${pageBackground}，之前页面背景为: ${oldPageBackground}`,
  )
}
const onChangedZoom = ({ zoomLevel, oldZoomLevel }) => {
  useLogger(
    'onChanged:pageZoom',
    '页面缩放比例发生变化，可用参数: { zoomLevel, oldZoomLevel }，当前页面缩放比例为:',
    zoomLevel,
    '%，之前页面缩放比例为:',
    oldZoomLevel,
    '%',
  )
}
const onChangedPageShowToc = (showToc) => {
  useLogger(
    'onChanged:pageShowToc',
    '页面大纲面板显示状态发生变化，可用参数: showToc，页面大纲面板显示状态为:',
    showToc,
  )
}
const onChangedpreview = (enabled) => {
  useLogger(
    'onChanged:pagePreview',
    `页面预览模式发生变化，可用参数: enabled，预览模式:`,
    enabled,
  )
}
const onChangedPageWatermark = ({ pageWatermark, oldPageWatermark }) => {
  useLogger(
    'onChanged:pageWatermark',
    '页面水印信息发生变化，可用参数: { pageWatermark, oldPageWatermark }，当前页面水印信息为:',
    pageWatermark,
    '之前页面水印信息为:',
    oldPageWatermark,
  )
}
const onFocus = () => {
  useLogger('onFocus', '编辑器获得焦点，可用参数: { editor, event }')
}
const onBlur = () => {
  useLogger('onBlur', '编辑器失去焦点，可用参数: { editor, event }')
}
const onSaved = () => {
  useLogger('onSaved', '文档已保存，无可用参数')
}
const onDestroy = () => {
  useLogger('onDestroy', '编辑器组件已销毁，无可用参数')
}

const showPane = ref(true)
onMounted(() => {
  const url = new URL(window.location.href)
  if (url.pathname === '/') {
    url.pathname = 'editor'
    window.history.replaceState(null, '', url.toString())
    return
  }
  if (url.searchParams.get('pane') == 'no') {
    showPane.value = false
  }
})
// 初始化设置面板
const initPane = () => {
  const pane = new Pane({
    container: window.document.querySelector('.config-panel'),
  })
  const tab = pane.addTab({
    pages: [
      { title: '参数设置' },
      { title: '事件/方法' },
      { title: '主题设置' },
    ],
  })
  initOptionsPane(tab)
  initEventsAndMethodsPane(tab)
  initThemesPane(tab)
  // 选中面板tab
  const url = new URL(window.location.href)
  let active = 'options'
  const tabs = ['options', 'events', 'themes']
  if (
    url.searchParams.get('tab') &&
    tabs.includes(url.searchParams.get('tab'))
  ) {
    active = url.searchParams.get('tab')
    showPane.value = true
  }
  const activeIndex = tabs.findIndex((item) => item === active)
  tab.pages[activeIndex].selected = true
  return pane
}
// 初始化参数设置面板
const initOptionsPane = (tab) => {
  const params = tab.pages[0]

  // 工具栏设置
  const toolbar = params.addFolder({
    title: '工具栏设置',
  })
  toolbar
    .addBinding(options.value.toolbar, 'defaultMode', {
      label: '默认工具栏',
      options: [
        { text: '专业工具栏', value: 'ribbon' },
        { text: '经典工具栏', value: 'classic' },
      ],
    })
    .on('change', ({ value }) => {
      editorRef.value.setToolbar({ mode: value, show: true })
    })
  toolbar.addBinding(options.value.toolbar, 'enableSourceEditor', {
    label: '源代码编辑',
  })
  const page = params.addFolder({
    title: '页面设置',
  })

  // 页面设置
  page
    .addBlade({
      view: 'list',
      label: '默认纸张大小',
      options: options.value.dicts.pageSizes.map((item) => ({
        text: item.label,
        value: item.label,
      })),
      value: 'A4',
    })
    .on('change', ({ value }) => {
      editorRef.value.setPage({
        size: value,
      })
    })
  page
    .addBinding(options.value.page, 'defaultOrientation', {
      label: '默认纸张方向',
      options: [
        { text: '纵向', value: 'horizontal' },
        { text: '横向', value: 'vertical' },
      ],
    })
    .on('change', ({ value }) => {
      editorRef.value.setPage({
        orientation: value,
      })
    })
  page
    .addBinding(options.value.page, 'defaultBackground', {
      label: '默认背景',
    })
    .on('change', ({ value }) => {
      editorRef.value.setPage({
        background: value,
      })
    })
  page
    .addBinding(options.value.page, 'showBreakMarks', {
      label: '默认显示换行符',
    })
    .on('change', ({ value }) => {
      editorRef.value.setPage({
        showBreakMarks: value,
      })
    })

  // 水印设置
  const watermark = params.addFolder({
    title: '页面水印设置',
  })
  watermark.addBinding(options.value.page.watermark, 'alpha', {
    label: '透明度',
    step: 0.1,
    min: 0,
    max: 1,
  })
  watermark.addBinding(options.value.page.watermark, 'fontFamily', {
    label: '字体',
    options: options.value.dicts.fonts.map((font) => ({
      text: font.label,
      value: font.value,
    })),
  })
  watermark.addBinding(options.value.page.watermark, 'fontSize', {
    label: '字体大小',
    step: 1,
    min: 10,
  })
  watermark.addBinding(options.value.page.watermark, 'fontColor', {
    label: '字体颜色',
  })
  watermark.addBinding(options.value.page.watermark, 'fontWeight', {
    label: '字体粗细',
    options: [
      { text: '正常', value: 'normal' },
      { text: '细体', value: 'lighter' },
      { text: '粗体', value: 'bold' },
      { text: '超粗', value: 'bolder' },
    ],
  })
  watermark.addBinding(options.value.page.watermark, 'type', {
    label: '水印类型',
    options: [
      { text: '紧凑型', value: 'compact' },
      { text: '宽松型', value: 'spacious' },
    ],
  })
  watermark.addBinding(options.value.page.watermark, 'text', {
    label: '水印内容',
  })

  // 文档设置
  const document = params.addFolder({
    title: '文档设置',
  })
  watermark.on('change', () => {
    editorRef.value.setWatermark(options.value.page.watermark)
  })
  document.addBinding(options.value.document, 'title', {
    label: '文档标题',
  })

  document
    .addBinding(options.value.document, 'placeholder', {
      label: '占位符',
    })
    .on('change', resetEditor)
  document
    .addBinding(options.value.document, 'characterLimit', {
      label: '字数限制',
      step: 1,
    })
    .on('change', resetEditor)
  document.addBinding(options.value.document, 'readOnly', {
    label: '只读模式',
  })
  document.addBinding(options.value.document, 'autofocus', {
    label: '自动获得焦点',
  })
  document.addBinding(options.value.document, 'enableBubbleMenu', {
    label: '启用气泡菜单',
  })
  document
    .addBinding(options.value.document, 'enableMarkdown', {
      label: '启用Markdown',
    })
    .on('change', resetEditor)
  document.addBinding(options.value.document, 'enableSpellcheck', {
    label: '启用拼写检查',
  })

  // 其他配置
  const other = params.addFolder({
    title: '其他设置',
  })
  other
    .addBinding(options.value.file, 'maxSize', {
      label: '文件大小限制(B)',
      step: 1,
    })
    .on('change', resetEditor)
  other.addBinding(options.value, 'shareUrl', {
    label: '分享链接设置',
    format: (v) => v.toString(),
  })
  // tab.on('change', ({ value }) => {
  //   console.log(value, options.value)
  // })

  // 导出配置
  const exportButton = params.addButton({
    title: '导出 JSON 配置',
  })
  exportButton.on('click', () => {
    const json = JSON.stringify(options.value, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'options.json'
    a.click()
    URL.revokeObjectURL(url)
  })

  // 复制配置
  const copyButton = params.addButton({
    title: '复制配置到剪切板',
  })
  copyButton.on('click', () => {
    const { copy } = useClipboard({
      source: JSON.stringify(options.value, null, 2),
    })
    copy()
    useAlert('当前配置信息已复制到剪切板。', '信息提示', 'success')
  })
}
// 初始化事件/方法面板
const initEventsAndMethodsPane = (tab) => {
  const events = tab.pages[1]
  // 查看事件信息
  const eventButton = events.addButton({
    title: '在控制台中查看所有事件信息',
  })
  eventButton.on('click', () => {
    useAlert('请手动打开浏览器控制台 (DevTools › Console) 查看事件信息。')
  })

  events.addBlade({
    view: 'separator',
  })

  // 获取配置
  const getOptionsButton = events.addButton({
    title: '获取当前配置',
    label: 'getOptions',
  })
  getOptionsButton.on('click', () => {
    useMessage('请手动打开浏览器控制台 (DevTools › Console) 查看输出结果。')
    useLogger('getOptions', '当前配置为:', editorRef.value.getOptions())
  })

  // 修改配置
  const setOptionsButton = events.addButton({
    title: '修改当前配置',
    label: 'setOptions',
  })
  setOptionsButton.on('click', () => {
    useAlert(
      '请手动打开浏览器控制台 (DevTools › Console) 查看输出结果，本示例修改了{ shareUrl: "https://umodoc.com" }。',
    )
    useLogger(
      'setOptions',
      '当前配置为:',
      editorRef.value.setOptions({ shareUrl: 'https://umodoc.com' }),
    )
  })

  events.addBlade({
    view: 'separator',
  })

  // 设置工具栏
  const setToolbarButton = events.addButton({
    title: '设置工具栏',
    label: 'setToolbar',
  })
  setToolbarButton.on('click', () => {
    editorRef.value.setToolbar({
      mode: 'classic',
      show: true,
    })
  })

  // 设置页面信息
  const setPageButton = events.addButton({
    title: '设置页面信息',
    label: 'setPage',
  })
  setPageButton.on('click', () => {
    editorRef.value.setPage({
      size: 'A5',
      background: 'rgb(233, 246, 227)',
    })
  })

  // 设置水印信息
  const setWatermarkButton = events.addButton({
    title: '设置水印信息',
    label: 'setWatermark',
  })
  setWatermarkButton.on('click', () => {
    editorRef.value.setWatermark({
      alpha: 0.2,
      fontSize: 24,
      text: '测试水印',
    })
  })

  // 设置文档信息
  const setDocumentButton = events.addButton({
    title: '设置文档信息',
    label: 'setDocument',
  })
  setDocumentButton.on('click', () => {
    useAlert(
      '本示例设置文档标题为: "测试标题"。setDocument({ title: "测试标题" })',
    )
    editorRef.value.setDocument({
      title: '测试标题',
    })
    options.value.document.title = '测试标题'
  })

  // 设置文档内容
  const setContentButton = events.addButton({
    title: '设置文档内容',
    label: 'setContent',
  })
  setContentButton.on('click', () => {
    editorRef.value.setContent(
      '这是调用 <code>setContent(...)</code> 方法更新后的内容',
    )
  })

  // 获取文档内容
  const getContentButton = events.addButton({
    title: '获取文档内容',
    label: 'getContent',
  })
  getContentButton.on('click', () => {
    useAlert('请手动打开浏览器控制台 (DevTools › Console) 查看输出结果。')
    useLogger('getContent', '当前文档内容为:', editorRef.value.getContent())
  })

  // 获取文档摘要
  const getContentExcerptButton = events.addButton({
    title: '获取文档摘要',
    label: 'getContentExcerpt',
  })
  getContentExcerptButton.on('click', () => {
    const excerpt = editorRef.value.getContentExcerpt()
    useAlert(
      excerpt !== '' ? `${excerpt}` : `当前文档无摘要信息`,
      '文档摘要信息',
    )
    editorRef.value.getContent()
  })

  // 保存文档内容
  const saveContentButton = events.addButton({
    title: '保存文档内容',
    label: 'saveContent',
  })
  saveContentButton.on('click', () => {
    editorRef.value.saveContent()
  })

  // 获取编辑器实例
  const getEditorButton = events.addButton({
    title: '获取编辑器实例',
    label: 'getEditor',
  })
  getEditorButton.on('click', () => {
    useAlert('请手动打开浏览器控制台 (DevTools › Console) 查看输出结果。')
    useLogger('getEditor', '当前编辑器信息为：', editorRef.value.getEditor())
  })

  events.addBlade({
    view: 'separator',
  })

  // 设置编辑器
  const setReadOnlyButton = events.addButton({
    title: '设为只读模式',
    label: 'setReadOnly',
  })
  setReadOnlyButton.on('click', () => {
    editorRef.value.setReadOnly()
  })

  // 获得焦点
  const focusButton = events.addButton({
    title: '设置编辑器获得焦点',
    label: 'focus',
  })
  focusButton.on('click', () => editorRef.value.focus())

  // 失去焦点
  const blurButton = events.addButton({
    title: '设置编辑器失去焦点',
    label: 'blur',
  })
  blurButton.on('click', () => editorRef.value.blur())

  events.addBlade({
    view: 'separator',
  })

  // 获取图片
  const getImageButton = events.addButton({
    title: '获取图片',
    label: 'getImage',
  })
  getImageButton.on('click', async () => {
    useMessage('请手动打开浏览器控制台 (DevTools › Console) 查看信息。')
    useLogger('getImage', await editorRef.value.getImage('png'))
  })

  // 获取文本
  const getTextButton = events.addButton({
    title: '获取文本',
    label: 'getText',
  })
  getTextButton.on('click', () => {
    useMessage('请手动打开浏览器控制台 (DevTools › Console) 查看信息。')
    useLogger('getText', editorRef.value.getText('png'))
  })

  // 获取 HTML
  const getHTMLButton = events.addButton({
    title: '获取 HTML',
    label: 'getHTML',
  })
  getHTMLButton.on('click', () => {
    useMessage('请手动打开浏览器控制台 (DevTools › Console) 查看信息。')
    useLogger('getHTML', editorRef.value.getHTML())
  })

  // 获取 JSON
  const getJSONButton = events.addButton({
    title: '获取 JSON',
    label: 'getJSON',
  })
  getJSONButton.on('click', () => {
    useMessage('请手动打开浏览器控制台 (DevTools › Console) 查看信息。')
    useLogger('getJSON', editorRef.value.getJSON())
  })

  events.addBlade({
    view: 'separator',
  })

  // 使用编辑器弹框
  const useAlertButton = events.addButton({
    title: '使用编辑器弹框',
    label: 'useAlert',
  })
  useAlertButton.on('click', () => {
    editorRef.value.useAlert({
      theme: 'success',
      header: 'Info',
      body: 'Hello World',
    })
  })

  // 使用编辑器对话框
  const useConfirmButton = events.addButton({
    title: '使用编辑器对话框',
    label: 'useConfirm',
  })
  useConfirmButton.on('click', () => {
    const confirm = editorRef.value.useConfirm({
      theme: 'success',
      header: 'Info',
      body: 'Hello World',
      onConfirm() {
        confirm.destroy()
      },
    })
  })

  // 使用编辑器消息提示
  const useMessageButton = events.addButton({
    title: '使用编辑器消息提示',
    label: 'useMessage',
  })
  useMessageButton.on('click', () => {
    editorRef.value.useMessage('info', 'Hello World')
  })
}
// 初始化主题设置面板
const initThemesPane = (tab) => {
  const themes = tab.pages[2]

  // 基本色
  const color = themes.addFolder({
    title: '基本色',
  })
  color.addBinding(themeVars, '--umo-primary-color', {
    label: '主题色',
  })
  color.addBinding(themeVars, '--umo-color-white', {
    label: '白色',
  })
  color.addBinding(themeVars, '--umo-color-black', {
    label: '黑色',
  })
  color.addBinding(themeVars, '--umo-warning-color', {
    label: '警告颜色',
  })
  color.addBinding(themeVars, '--umo-error-color', {
    label: '错误颜色',
  })
  color.addBinding(themeVars, '--umo-container-background', {
    label: '容器背景',
  })
  color.addBinding(themeVars, '--umo-button-hover-background', {
    label: '按钮hover背景',
  })

  // 字体
  const text = themes.addFolder({
    title: '字体',
  })
  text.addBinding(themeVars, '--umo-font-family', {
    label: '基本字体',
  })
  text.addBinding(themeVars, '--umo-font-size', {
    label: '字体大小',
  })
  text.addBinding(themeVars, '--umo-font-size-small', {
    label: '小号字体',
  })
  text.addBinding(themeVars, '--umo-text-color', {
    label: '基础字体颜色',
  })
  text.addBinding(themeVars, '--umo-text-color-light', {
    label: '浅色字体颜色',
  })
  text.addBinding(themeVars, '--umo-text-color-disabled', {
    label: '字体禁用颜色',
  })

  // 边框
  const border = themes.addFolder({
    title: '边框',
  })
  border.addBinding(themeVars, '--umo-shadow', {
    label: '阴影',
  })
  border.addBinding(themeVars, '--umo-border-color', {
    label: '基础边框颜色',
  })
  border.addBinding(themeVars, '--umo-border-color-dark', {
    label: '深色边框颜色',
  })
  border.addBinding(themeVars, '--umo-border-color-light', {
    label: '浅色边框颜色',
  })

  // 圆角
  const radius = themes.addFolder({
    title: '圆角',
  })
  radius.addBinding(themeVars, '--umo-radius', {
    label: '基础圆角',
  })
  radius.addBinding(themeVars, '--umo-radius-medium', {
    label: '较大圆角',
  })

  // 弹出层
  const layer = themes.addFolder({
    title: '弹出层',
  })
  layer.addBinding(themeVars, '--umo-popup-content-padding', {
    label: 'Popup内容留白',
  })
  layer.addBinding(themeVars, '--umo-popup-max-height', {
    label: 'Popup最大高度',
  })
  layer.addBinding(themeVars, '--umo-tooltip-content-padding', {
    label: 'Tooltip内容留白',
  })
  layer.addBinding(themeVars, '--umo-mask-color', {
    label: '弹窗蒙版颜色',
  })

  // 编辑器
  const editor = themes.addFolder({
    title: '编辑器',
  })
  editor.addBinding(themeVars, '--umo-content-placeholder-color', {
    label: 'placeholder颜色',
  })
  editor.addBinding(themeVars, '--umo-content-node-border', {
    label: '节点边框',
  })
  editor.addBinding(themeVars, '--umo-content-node-radius', {
    label: '节点圆角',
  })
  editor.addBinding(themeVars, '--umo-content-node-bottom', {
    label: '节点之间的间隔',
  })
  editor.addBinding(themeVars, '--umo-content-node-selected-background', {
    label: '节点选中背景',
  })
  editor.addBinding(themeVars, '--umo-content-table-border-color', {
    label: '表格边框颜色',
  })
  editor.addBinding(themeVars, '--umo-content-table-thead-background', {
    label: '表格标题栏背景',
  })
  editor.addBinding(themeVars, '--umo-content-table-selected-background', {
    label: '单元格选中背景',
  })
  editor.addBinding(themeVars, '--umo-content-line-number-color', {
    label: '行号颜色',
  })
  editor.addBinding(themeVars, '--umo-content-search-result-background', {
    label: '查找和替换高亮背景',
  })
  editor.addBinding(
    themeVars,
    '--umo-content-search-result-current-background',
    {
      label: '查找和替换当前背景',
    },
  )
  editor.addBinding(themeVars, '--umo-content-invisible-break-color', {
    label: '换行符颜色',
  })
  editor.addBinding(themeVars, '--umo-content-code-color', {
    label: '代码颜色',
  })
  editor.addBinding(themeVars, '--umo-content-code-background', {
    label: '代码背景颜色',
  })
  editor.addBinding(themeVars, '--umo-content-code-family', {
    label: '代码字体',
  })

  // 滚动条
  const scrollbar = themes.addFolder({
    title: '滚动条',
  })
  scrollbar.addBinding(themeVars, '--umo-scrollbar-size', {
    label: '滚动条宽度',
  })
  scrollbar.addBinding(themeVars, '--umo-scrollbar-thumb-color', {
    label: '滚动条颜色',
  })
  scrollbar.addBinding(themeVars, '--umo-scrollbar-thumb-hover-color', {
    label: '滚动条hover颜色',
  })

  tab.on('change', () => {
    const style = document.querySelector('style[umo-editor-theme]')
    style.innerHTML = getThemeCSS()
  })

  // 复制配置
  const copyButton = themes.addButton({
    title: '复制主题配置到剪切板',
  })
  copyButton.on('click', () => {
    const { copy } = useClipboard({
      source: getThemeCSS(),
    })
    copy()
    useAlert('当前主题配置已复制到剪切板。', '信息提示', 'success')
  })
}

watch(
  () => showPane.value,
  async (val) => {
    if (val) {
      await nextTick()
      options.value = editorRef.value.getOptions()
      defaultOptions = Object.assign({}, options.value)
      initPane()
    }
  },
  { immediate: true },
)
</script>

<style lang="less" scoped>
.demo-container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  min-width: 680px;
  .header-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    border-bottom: solid 1px #ddd;
    height: 60px;
    box-sizing: border-box;
    background-color: #fff;
    position: relative;
    a {
      text-decoration: none;
    }
    .logo {
      display: flex;
      color: #eee;
      &:hover {
        opacity: 0.8;
      }
      img {
        height: 24px;
        margin-top: -3px;
        margin-right: 20px;
      }
      span {
        color: #333;
        font-size: 18px;
        margin-left: 15px;
      }
    }
    .title {
      max-width: calc(100vw - 800px);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .actions {
      display: flex;
      align-items: center;
      gap: 10px;
      a {
        display: flex;
        align-items: center;
        font-size: 14px;
        color: #666;
        font-weight: 600;
        cursor: pointer;
        &:hover {
          color: #333;
        }
        img {
          margin-right: 5px;
        }
        &.expand {
          img {
            transform: rotate(180deg);
          }
        }
      }
    }
  }
  .body-container {
    display: flex;
    height: calc(100vh - 60px);
  }
  .editor-container {
    position: relative;
    flex: 1;
    min-width: 480px;
  }
  .config-panel {
    width: 340px;
    border-left: solid 1px #ddd;
    box-sizing: 10;
  }
}
</style>

<style lang="less">
.config-panel {
  .tp-rotv {
    --bs-br: 0;
    --cnt-hp: 6px;
    --cnt-usz: 24px;
    --cnt-vp: 6px;
    --bld-hp: 6px;
    --in-fg: #666;
    --tp-base-background-color: #fff;
    --tp-base-shadow-color: hsla(0, 0%, 0%, 0);
    --tp-button-background-color: hsla(230, 21%, 69%, 0.1);
    --tp-button-background-color-active: hsla(230, 11%, 53%, 0.22);
    --tp-button-background-color-focus: hsla(230, 12%, 53%, 0.18);
    --tp-button-background-color-hover: hsla(230, 14%, 58%, 0.14);
    --tp-button-foreground-color: hsla(230, 10%, 30%, 1);
    --tp-container-background-color: hsla(230, 15%, 30%, 0.1);
    --tp-container-background-color-active: hsla(230, 15%, 30%, 0.12);
    --tp-container-background-color-focus: hsla(230, 15%, 30%, 0.08);
    --tp-container-background-color-hover: hsla(230, 15%, 30%, 0.14);
    --tp-container-foreground-color: hsla(230, 10%, 30%, 1);
    --tp-groove-foreground-color: hsla(230, 15%, 30%, 0.1);
    --tp-input-background-color: hsla(230, 21%, 69%, 0.1);
    --tp-input-background-color-active: hsla(230, 11%, 53%, 0.22);
    --tp-input-background-color-focus: hsla(230, 12%, 53%, 0.18);
    --tp-input-background-color-hover: hsla(230, 14%, 58%, 0.14);
    --tp-input-foreground-color: hsla(230, 10%, 30%, 1);
    --tp-label-foreground-color: hsla(230, 10%, 30%, 0.7);
    --tp-label-foreground-color: hsla(230, 10%, 30%, 0.7);
    --tp-monitor-background-color: hsla(230, 15%, 30%, 0.1);
    --tp-monitor-foreground-color: hsla(230, 10%, 30%, 0.5);
    box-shadow: none;
    font-size: 12px;
    height: 100%;
  }
  .tp-tbiv {
    .tp-tbiv_b {
      cursor: pointer;
      &::before {
        bottom: 1px;
      }
    }
    &:not(.tp-tbiv-sel) {
      .tp-tbiv_b::before {
        background: none;
      }
    }
    &.tp-tbiv-sel {
      .tp-tbiv_t {
        color: #333;
      }
    }
  }
  .tp-tabv_t::before {
    height: 1px !important;
  }
  .tp-fldv_b {
    background: none !important;
    border-bottom: solid 1px #eee;
    padding: 0;
    height: 36px;
    .tp-fldv {
      &_b {
        padding-top: 10px;
        padding-bottom: 10px;
      }
      &_t {
        font-size: 14px;
      }
    }
    .tp-fldv_t {
      padding-left: 0;
    }
  }
  .tp-rotv_c {
    height: 100% !important;
    overflow: hidden !important;
    .tp-tabv {
      height: 100%;
    }
    .tp-tabv_c {
      height: calc(100% - 24px);
      overflow: auto;
      &::-webkit-scrollbar {
        width: 4px !important;
        height: 4px !important;
        position: absolute;
      }
      &::-webkit-scrollbar-track {
        width: 4px !important;
        background: transparent;
      }
      &:hover::-webkit-scrollbar-thumb {
        background-color: rgb(0 0 0 / 20%);
        background-clip: padding-box;
        border-radius: 1em;
        transition: background-color 0.3s;
        cursor: pointer;
      }
      &::-webkit-scrollbar-thumb:hover {
        background-color: rgb(0 0 0 / 35%);
      }
    }
  }
  .tp-popv {
    border: solid 1px #eee;
    border-radius: 3px;
    margin: 5px;
  }
  .tp-tbiv_t {
    height: 36px;
    line-height: 36px;
  }
  .tp-tbpv_c {
    padding: 10px 18px 15px 18px;
    .tp-fldv {
      margin-left: 0;
    }
  }
  .tp-fldv_c {
    padding: 0;
  }
  .tp-lblv {
    padding: 3px 0;
  }
  .tp-lblv_l {
    padding-left: 0;
    font-weight: 400;
  }
  .tp-rotv_m,
  .tp-fldv_m {
    background: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTkgMTJsMTIgMTItMTIgMTIiIHN0cm9rZT0iIzMzMyIgc3Ryb2tlLXdpZHRoPSI0IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48L3N2Zz4=')
      no-repeat center center;
    background-size: cover;
    height: 12px;
    right: 0;
  }
  .tp-txtv_i,
  .tp-lstv_s {
    font-weight: 400;
  }
  .tp-btnv_b {
    height: 28px;
  }
  .tp-ckbv_w {
    width: 16px;
    height: 16px;
    margin: 4px 0;
    svg path {
      stroke-width: 1.5;
    }
  }
  .tp-colswv_b {
    border: solid 1px #eee;
    border-radius: var(--bld-br);
    overflow: hidden;
    &::after {
      display: none !important;
    }
  }
  .tp-sprv_r {
    height: 1px;
    margin: 10px 0;
  }
  .tp-sldv_k::after {
    background-color: var(--in-fg) !important;
    border-radius: 50%;
  }
}
</style>
