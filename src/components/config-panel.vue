<template></template>

<script setup>
import { Pane } from 'tweakpane'
import { useClipboard } from '@vueuse/core'
import { themeVars, darkThemeVars, getThemeCSS } from '../configs/theme'
import { t, locale } from '@/composables/i18n'

const { editorRef, defaultActive } = defineProps({
  editorRef: {
    type: Object,
    required: true,
  },
  defaultActive: {
    type: Number,
    default: 0,
  },
})

const emits = defineEmits(['change-lang', 'change-theme', 'reset-editor'])

let options = {}

const useAlert = (content, title = t('notification'), theme = 'info') => {
  const dialog = editorRef.useAlert({
    attach: 'body',
    theme,
    header: title,
    body: content,
    confirmBtn: locale.value === 'zh-CN' ? '确定' : 'Ok',
    onConfirm() {
      dialog.destroy()
    },
  })
}
const useConsole = () => useAlert(t('openConsole'))

// 初始化设置面板
const initPane = () => {
  const pane = new Pane({
    container: window.document.querySelector('#config-panel'),
  })
  const pages = [
    { title: t('options.title') },
    { title: t('ems.title') },
    { title: t('themes.title') },
  ]
  const tab = pane.addTab({ pages })
  initOptionsPane(tab)
  initEventsAndMethodsPane(tab)
  initThemesPane(tab)

  // 选中面板tab
  tab.pages[defaultActive].selected = true

  return pane
}
// 初始化参数设置面板
const initOptionsPane = (tab) => {
  const params = tab.pages[0]

  // 工具栏设置
  const toolbar = params.addFolder({
    title: t('options.toolbar.name'),
  })
  toolbar
    .addBinding(options.toolbar, 'defaultMode', {
      label: t('options.toolbar.mode'),
      options: [
        { text: t('options.toolbar.ribbon'), value: 'ribbon' },
        { text: t('options.toolbar.classic'), value: 'classic' },
      ],
    })
    .on('change', ({ value }) => {
      editorRef.setToolbar({ mode: value, show: true })
    })
  toolbar.addBinding(options.toolbar, 'enableSourceEditor', {
    label: t('options.toolbar.enableSourceEditor'),
  })
  toolbar.addBinding(options.toolbar.importWord, 'enabled', {
    label: t('options.toolbar.importWord'),
  })

  // 页面设置
  const page = params.addFolder({
    title: t('options.page.name'),
  })
  page
    .addBlade({
      view: 'list',
      label: t('options.page.defaultPageSize'),
      options: options.dicts.pageSizes.map((item) => ({
        text: l(item.label),
        value: l(item.label),
      })),
      value: 'A4',
    })
    .on('change', ({ value }) => {
      editorRef.setPage({
        size: value,
      })
    })
  page
    .addBinding(options.page, 'defaultOrientation', {
      label: t('options.page.defaultOrientation'),
      options: [
        { text: t('options.page.portrait'), value: 'portrait' },
        { text: t('options.page.landscape'), value: 'landscape' },
      ],
    })
    .on('change', ({ value }) => {
      editorRef.setPage({
        orientation: value,
      })
    })
  page
    .addBinding(options.page, 'defaultBackground', {
      label: t('options.page.defaultBackground'),
    })
    .on('change', ({ value }) => {
      editorRef.setPage({
        background: value,
      })
    })

  // 水印设置
  const watermark = params.addFolder({
    title: t('options.watermark.name'),
  })
  watermark.addBinding(options.page.watermark, 'alpha', {
    label: t('options.watermark.alpha'),
    step: 0.1,
    min: 0,
    max: 1,
  })
  watermark.addBinding(options.page.watermark, 'fontFamily', {
    label: t('options.watermark.fontFamily'),
    options: options.dicts.fonts.map((font) => ({
      text: l(font.label),
      value: font.value,
    })),
  })
  watermark.addBinding(options.page.watermark, 'fontSize', {
    label: t('options.watermark.fontSize'),
    step: 1,
    min: 10,
  })
  watermark.addBinding(options.page.watermark, 'fontColor', {
    label: t('options.watermark.fontColor'),
  })
  watermark.addBinding(options.page.watermark, 'fontWeight', {
    label: t('options.watermark.fontWeight'),
    options: [
      { text: t('options.watermark.normal'), value: 'normal' },
      { text: t('options.watermark.lighter'), value: 'lighter' },
      { text: t('options.watermark.bold'), value: 'bold' },
      { text: t('options.watermark.bolder'), value: 'bolder' },
    ],
  })
  watermark.addBinding(options.page.watermark, 'type', {
    label: t('options.watermark.type'),
    options: [
      { text: t('options.watermark.compact'), value: 'compact' },
      { text: t('options.watermark.spacious'), value: 'spacious' },
    ],
  })
  watermark.addBinding(options.page.watermark, 'text', {
    label: t('options.watermark.text'),
  })
  watermark.on('change', () => {
    editorRef.setWatermark(options.page.watermark)
  })

  // 文档设置
  const document = params.addFolder({
    title: t('options.document.name'),
  })
  document.addBinding(options.document, 'title', {
    label: t('options.document.title'),
  })
  document
    .addBinding(options.document, 'characterLimit', {
      label: t('options.document.characterLimit'),
      step: 1,
    })
    .on('change', () => emits('reset-editor'))
  document.addBinding(options.document, 'readOnly', {
    label: t('options.document.readOnly'),
  })
  document.addBinding(options.document, 'autofocus', {
    label: t('options.document.autofocus'),
  })
  document.addBinding(options.document, 'enableBubbleMenu', {
    label: t('options.document.enableBubbleMenu'),
  })
  document.addBinding(options.document, 'enableBlockMenu', {
    label: t('options.document.enableBlockMenu'),
  })
  document
    .addBinding(options.document, 'enableMarkdown', {
      label: t('options.document.enableMarkdown'),
    })
    .on('change', () => emits('reset-editor'))
  document.addBinding(options.document, 'enableSpellcheck', {
    label: t('options.document.enableSpellcheck'),
  })
  document.addBinding(options.document.autoSave, 'enabled', {
    label: t('options.document.autoSave.enabled'),
  })
  document.addBinding(options.document.autoSave, 'interval', {
    label: t('options.document.autoSave.interval'),
    step: 1000,
  })

  // 文档助手配置
  const assistant = params.addFolder({
    title: t('options.assistant.name'),
  })
  assistant.addBinding(options.assistant, 'enabled', {
    label: t('options.assistant.enabled'),
  })
  assistant.addBinding(options.assistant, 'maxlength', {
    label: t('options.assistant.maxlength'),
    step: 1,
  })

  // 其他配置
  const other = params.addFolder({
    title: t('options.other.name'),
  })
  other
    .addBinding(options.file, 'maxSize', {
      label: t('options.other.fileMaxSize'),
      step: 1,
    })
    .on('change', () => emits('reset-editor'))
  other.addBinding(options, 'shareUrl', {
    label: t('options.other.shareUrl'),
    format: (v) => v.toString(),
  })
  // tab.on('change', ({ value }) => {
  //   console.log(value, options)
  // })

  // 导出配置
  const exportButton = params.addButton({
    title: t('options.export'),
  })
  exportButton.on('click', () => {
    const data = Object.assign({}, options)
    data.document.content = ''
    data.templates = []
    const json = JSON.stringify(data, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = window.document.createElement('a')
    a.href = url
    a.download = 'options.json'
    a.click()
    URL.revokeObjectURL(url)
  })

  // 复制配置
  const copyButton = params.addButton({
    title: t('options.copy'),
  })
  copyButton.on('click', () => {
    const data = Object.assign({}, options)
    data.document.content = ''
    data.templates = []
    const { copy } = useClipboard({
      source: JSON.stringify(data, null, 2),
    })
    copy()
    useAlert(t('options.exportSuccess'), t('notification'), 'success')
  })
}
// 初始化事件/方法面板
const initEventsAndMethodsPane = (tab) => {
  const events = tab.pages[1]
  // 查看事件信息
  const eventButton = events.addButton({
    title: t('ems.viewEventDetails'),
  })
  eventButton.on('click', () => {
    useConsole()
  })

  events.addBlade({
    view: 'separator',
  })

  // 获取配置
  const getOptionsButton = events.addButton({
    title: t('ems.getOptions'),
    label: 'getOptions',
  })
  getOptionsButton.on('click', () => {
    useConsole()
    useLogger('getOptions', editorRef.getOptions())
  })

  // 修改配置
  const setOptionsButton = events.addButton({
    title: t('ems.setOptions'),
    label: 'setOptions',
  })
  setOptionsButton.on('click', () => {
    useAlert(
      t('ems.setOptionsAlert', {
        content: '{ shareUrl: "https://umodoc.com" }',
      }),
    )
    useLogger(
      'setOptions',
      editorRef.setOptions({ shareUrl: 'https://umodoc.com' }),
    )
  })

  events.addBlade({
    view: 'separator',
  })

  // 设置工具栏
  const setToolbarButton = events.addButton({
    title: t('ems.setToolbar'),
    label: 'setToolbar',
  })
  setToolbarButton.on('click', () => {
    editorRef.setToolbar({
      mode: options.toolbar.defaultMode === 'classic' ? 'ribbon' : 'classic',
      show: true,
    })
  })

  // 设置页面信息
  const setPageButton = events.addButton({
    title: t('ems.setPage'),
    label: 'setPage',
  })
  setPageButton.on('click', () => {
    editorRef.setPage({
      size: 'A5',
      background: 'rgb(233, 246, 227)',
    })
  })

  // 设置水印信息
  const setWatermarkButton = events.addButton({
    title: t('ems.setWatermark'),
    label: 'setWatermark',
  })
  setWatermarkButton.on('click', () => {
    editorRef.setWatermark({
      alpha: 0.2,
      fontSize: 24,
      text: locale.value === 'zh-CN' ? '测试水印' : 'Test Watermark',
    })
  })

  // 设置语言
  const setLocaleButton = events.addButton({
    title: t('ems.setLocale'),
    label: 'setLocale',
  })
  setLocaleButton.on('click', () => {
    emits('change-lang', locale.value === 'zh-CN' ? 'en-US' : 'zh-CN')
  })

  // 设置主题
  const setThemeButton = events.addButton({
    title: t('ems.setTheme'),
    label: 'setTheme',
  })
  setThemeButton.on('click', () => {
    emits('change-theme', options.theme === 'light' ? 'dark' : 'light')
  })

  // 设置文档信息
  const setDocumentButton = events.addButton({
    title: t('ems.setDocument'),
    label: 'setDocument',
  })
  setDocumentButton.on('click', () => {
    const title = locale.value === 'zh-CN' ? '测试标题' : 'Test Title'
    useAlert(
      t('ems.setDocumentAlert', {
        content: title,
      }),
    )
    editorRef.setDocument({
      title: title,
    })
    options.document.title = title
  })

  // 获取页面配置
  const getPageButton = events.addButton({
    title: t('ems.getPage'),
    label: 'getPage',
  })
  getPageButton.on('click', () => {
    useLogger('getPage', editorRef.getPage())
  })

  // 设置文档内容
  const setContentButton = events.addButton({
    title: t('ems.setContent'),
    label: 'setContent',
  })
  setContentButton.on('click', () => {
    editorRef.setContent(t('ems.setContentText'))
  })

  // 获取文档内容
  const getContentButton = events.addButton({
    title: t('ems.getContent'),
    label: 'getContent',
  })
  getContentButton.on('click', () => {
    useConsole()
    useLogger('getContent', editorRef.getContent())
  })

  // 获取文档摘要
  const getContentExcerptButton = events.addButton({
    title: t('ems.getContentExcerpt'),
    label: 'getContentExcerpt',
  })
  getContentExcerptButton.on('click', () => {
    const excerpt = editorRef.getContentExcerpt()
    useAlert(
      excerpt !== '' ? `${excerpt}` : t('ems.getContentExcerptAlert'),
      t('ems.getContentExcerpt'),
    )
    editorRef.getContent()
  })

  // 保存文档内容
  const saveContentButton = events.addButton({
    title: t('ems.saveContent'),
    label: 'saveContent',
  })
  saveContentButton.on('click', () => {
    editorRef.saveContent()
  })

  // 获取编辑器实例
  const getEditorButton = events.addButton({
    title: t('ems.getEditor'),
    label: 'getEditor',
  })
  getEditorButton.on('click', () => {
    useConsole()
    useLogger('getEditor', editorRef.getEditor())
  })

  // 获取编辑器实例
  const useEditorButton = events.addButton({
    title: t('ems.useEditor'),
    label: 'useEditor',
  })
  useEditorButton.on('click', () => {
    useConsole()
    useLogger('useEditor', editorRef.useEditor())
  })

  // 获取页面大纲
  const getTocButton = events.addButton({
    title: t('ems.getTableOfContents'),
    label: 'getTableOfContents',
  })
  getTocButton.on('click', () => {
    useConsole()
    useLogger('getTableOfContents', editorRef.getTableOfContents())
  })

  // 获取当前选中的文本内容
  const getSelectionTextButton = events.addButton({
    title: t('ems.getSelectionText'),
    label: 'getSelectionText',
  })
  getSelectionTextButton.on('click', () => {
    useConsole()
    useLogger('getSelectionText', editorRef.getSelectionText())
  })

  // 获取当前选中的节点信息
  const getSelectionNodeButton = events.addButton({
    title: t('ems.getSelectionNode'),
    label: 'getSelectionNode',
  })
  getSelectionNodeButton.on('click', () => {
    useConsole()
    useLogger('getSelectionNode', editorRef.getSelectionNode())
  })

  // 选中当前节点
  const setCurrentNodeSelectionButton = events.addButton({
    title: t('ems.setCurrentNodeSelection'),
    label: 'setCurrentNodeSelection',
  })
  setCurrentNodeSelectionButton.on('click', () => {
    useConsole()
    useLogger('setCurrentNodeSelection', editorRef.setCurrentNodeSelection())
  })

  // 删除当前选中节点
  const deleteSelectionNodeButton = events.addButton({
    title: t('ems.deleteSelectionNode'),
    label: 'deleteSelectionNode',
  })
  deleteSelectionNodeButton.on('click', () => {
    editorRef.deleteSelectionNode()
  })

  // 获取语言
  const getLocaleButton = events.addButton({
    title: t('ems.getLocale'),
    label: 'getLocale',
  })
  getLocaleButton.on('click', () => {
    const locale = editorRef.getLocale()
    useAlert(t('ems.getLocaleAlert') + locale)
    useLogger('getLocale', locale)
  })

  // 获取 i18n
  const getI18nButton = events.addButton({
    title: t('ems.getI18n'),
    label: 'getI18n',
  })
  getI18nButton.on('click', () => {
    const i18n = editorRef.getI18n()
    useConsole()
    useLogger('getI18n', i18n)
  })

  events.addBlade({
    view: 'separator',
  })

  // 设为只读模式
  const setReadOnlyButton = events.addButton({
    title: t('ems.setReadOnly'),
    label: 'setReadOnly',
  })
  setReadOnlyButton.on('click', () => {
    editorRef.setReadOnly()
  })

  // 打印页面
  const printButton = events.addButton({
    title: t('ems.print'),
    label: 'print',
  })
  printButton.on('click', () => {
    editorRef.print()
  })

  // 获得焦点
  const focusButton = events.addButton({
    title: t('ems.focus'),
    label: 'focus',
  })
  focusButton.on('click', () => editorRef.focus())

  // 失去焦点
  const blurButton = events.addButton({
    title: t('ems.blur'),
    label: 'blur',
  })
  blurButton.on('click', () => editorRef.blur())

  events.addBlade({
    view: 'separator',
  })

  // 获取图片
  const getImageButton = events.addButton({
    title: t('ems.getImage'),
    label: 'getImage',
  })
  getImageButton.on('click', async () => {
    useConsole()
    useLogger('getImage', await editorRef.getImage('png'))
  })

  // 获取文本
  const getTextButton = events.addButton({
    title: t('ems.getText'),
    label: 'getText',
  })
  getTextButton.on('click', () => {
    useConsole()
    useLogger('getText', editorRef.getText('png'))
  })

  // 获取 HTML
  const getHTMLButton = events.addButton({
    title: t('ems.getHTML'),
    label: 'getHTML',
  })
  getHTMLButton.on('click', () => {
    useConsole()
    useLogger('getHTML', editorRef.getHTML())
  })

  // 获取 JSON
  const getJSONButton = events.addButton({
    title: t('ems.getJSON'),
    label: 'getJSON',
  })
  getJSONButton.on('click', () => {
    useConsole()
    useLogger('getJSON', editorRef.getJSON())
  })

  events.addBlade({
    view: 'separator',
  })

  // 使用编辑器弹框
  const useAlertButton = events.addButton({
    title: t('ems.useAlert'),
    label: 'useAlert',
  })
  useAlertButton.on('click', () => {
    const alert = editorRef.useAlert({
      theme: 'success',
      header: 'Info',
      confirmBtn: locale.value === 'zh-CN' ? '确定' : 'Ok',
      body: 'Hello World',
      onConfirm() {
        alert.destroy()
      },
    })
  })

  // 使用编辑器对话框
  const useConfirmButton = events.addButton({
    title: t('ems.useConfirm'),
    label: 'useConfirm',
  })
  useConfirmButton.on('click', () => {
    const confirm = editorRef.useConfirm({
      theme: 'success',
      header: 'Info',
      body: 'Hello World',
      confirmBtn: locale.value === 'zh-CN' ? '确定' : 'Ok',
      onConfirm() {
        confirm.destroy()
      },
    })
  })

  // 使用编辑器消息提示
  const useMessageButton = events.addButton({
    title: t('ems.useMessage'),
    label: 'useMessage',
  })
  useMessageButton.on('click', () => {
    editorRef.useMessage('info', 'Hello World')
  })
}
// 初始化主题设置面板
const initThemesPane = (tab) => {
  const themes = tab.pages[2]

  // 基本色
  const color = themes.addFolder({
    title: t('themes.basicColor'),
  })
  color.addBinding(themeVars, '--umo-primary-color', {
    label: t('themes.primaryColor'),
  })
  color.addBinding(themeVars, '--umo-color-white', {
    label: t('themes.whiteColor'),
  })
  color.addBinding(themeVars, '--umo-color-black', {
    label: t('themes.blackColor'),
  })
  color.addBinding(themeVars, '--umo-warning-color', {
    label: t('themes.warningColor'),
  })
  color.addBinding(themeVars, '--umo-error-color', {
    label: t('themes.errorColor'),
  })
  color.addBinding(themeVars, '--umo-container-background', {
    label: t('themes.containerBackground'),
  })
  color.addBinding(themeVars, '--umo-button-hover-background', {
    label: t('themes.buttonHoverBackground'),
  })
  color.addBinding(themeVars, '--umo-text-selection-background', {
    label: t('themes.textSelectionBackground'),
  })

  // 字体
  const text = themes.addFolder({
    title: t('themes.font'),
  })
  text.addBinding(themeVars, '--umo-font-family', {
    label: t('themes.fontFamily'),
  })
  text.addBinding(themeVars, '--umo-font-size', {
    label: t('themes.fontSize'),
  })
  text.addBinding(themeVars, '--umo-font-size-small', {
    label: t('themes.fontSizeSmall'),
  })
  text.addBinding(themeVars, '--umo-text-color', {
    label: t('themes.textColor'),
  })
  text.addBinding(themeVars, '--umo-text-color-light', {
    label: t('themes.textColorLight'),
  })
  text.addBinding(themeVars, '--umo-text-color-disabled', {
    label: t('themes.textColorDisabled'),
  })

  // 边框
  const border = themes.addFolder({
    title: t('themes.border'),
  })
  border.addBinding(themeVars, '--umo-shadow', {
    label: t('themes.shadow'),
  })
  border.addBinding(themeVars, '--umo-border-color', {
    label: t('themes.borderColor'),
  })
  border.addBinding(themeVars, '--umo-border-color-dark', {
    label: t('themes.borderColorDark'),
  })
  border.addBinding(themeVars, '--umo-border-color-light', {
    label: t('themes.borderColorLight'),
  })

  // 圆角
  const radius = themes.addFolder({
    title: t('themes.radius'),
  })
  radius.addBinding(themeVars, '--umo-radius', {
    label: t('themes.radiusBase'),
  })
  radius.addBinding(themeVars, '--umo-radius-medium', {
    label: t('themes.radiusMedium'),
  })

  // 弹出层
  const layer = themes.addFolder({
    title: t('themes.layer'),
  })
  layer.addBinding(themeVars, '--umo-popup-content-padding', {
    label: t('themes.popupContentPadding'),
  })
  layer.addBinding(themeVars, '--umo-popup-max-height', {
    label: t('themes.popupMaxHeight'),
  })
  layer.addBinding(themeVars, '--umo-tooltip-content-padding', {
    label: t('themes.tooltipContentPadding'),
  })
  layer.addBinding(themeVars, '--umo-mask-color', {
    label: t('themes.maskColor'),
  })

  // 编辑器
  const editor = themes.addFolder({
    title: t('themes.editor'),
  })
  editor.addBinding(themeVars, '--umo-content-placeholder-color', {
    label: t('themes.contentPlaceholderColor'),
  })
  editor.addBinding(themeVars, '--umo-content-text-color', {
    label: t('themes.contentTextColor'),
  })
  editor.addBinding(themeVars, '--umo-content-node-border', {
    label: t('themes.contentNodeBorder'),
  })
  editor.addBinding(themeVars, '--umo-content-node-radius', {
    label: t('themes.contentNodeRadius'),
  })
  editor.addBinding(themeVars, '--umo-content-node-bottom', {
    label: t('themes.contentNodeBottom'),
  })
  editor.addBinding(themeVars, '--umo-content-node-selected-background', {
    label: t('themes.contentNodeSelectedBackground'),
  })
  editor.addBinding(themeVars, '--umo-content-table-border-color', {
    label: t('themes.contentTableBorderColor'),
  })
  editor.addBinding(themeVars, '--umo-content-table-thead-background', {
    label: t('themes.contentTableTheadBackground'),
  })
  editor.addBinding(themeVars, '--umo-content-table-selected-background', {
    label: t('themes.contentTableSelectedBackground'),
  })
  editor.addBinding(themeVars, '--umo-content-line-number-color', {
    label: t('themes.contentLineNumberColor'),
  })
  editor.addBinding(themeVars, '--umo-content-search-result-background', {
    label: t('themes.contentSearchResultBackground'),
  })
  editor.addBinding(
    themeVars,
    '--umo-content-search-result-current-background',
    {
      label: t('themes.contentSearchResultCurrentBackground'),
    },
  )
  editor.addBinding(themeVars, '--umo-content-invisible-break-color', {
    label: t('themes.contentInvisibleBreakColor'),
  })
  editor.addBinding(themeVars, '--umo-content-code-color', {
    label: t('themes.contentCodeColor'),
  })
  editor.addBinding(themeVars, '--umo-content-code-background', {
    label: t('themes.contentCodeBackground'),
  })
  editor.addBinding(themeVars, '--umo-content-code-family', {
    label: t('themes.contentCodeFamily'),
  })

  // 滚动条
  const scrollbar = themes.addFolder({
    title: t('themes.scrollbar'),
  })
  scrollbar.addBinding(themeVars, '--umo-scrollbar-size', {
    label: t('themes.scrollbarSize'),
  })
  scrollbar.addBinding(themeVars, '--umo-scrollbar-thumb-color', {
    label: t('themes.scrollbarThumbColor'),
  })
  scrollbar.addBinding(themeVars, '--umo-scrollbar-thumb-hover-color', {
    label: t('themes.scrollbarThumbHoverColor'),
  })

  // 暗色主题
  const dark = themes.addFolder({
    title: t('themes.dark'),
  })
  dark.addBinding(darkThemeVars, '--umo-color-white', {
    label: t('themes.whiteColor'),
  })
  dark.addBinding(darkThemeVars, '--umo-color-black', {
    label: t('themes.blackColor'),
  })
  dark.addBinding(darkThemeVars, '--umo-warning-color', {
    label: t('themes.warningColor'),
  })
  dark.addBinding(darkThemeVars, '--umo-error-color', {
    label: t('themes.errorColor'),
  })
  dark.addBinding(darkThemeVars, '--umo-container-background', {
    label: t('themes.containerBackground'),
  })
  dark.addBinding(darkThemeVars, '--umo-button-hover-background', {
    label: t('themes.buttonHoverBackground'),
  })
  dark.addBinding(darkThemeVars, '--umo-text-color', {
    label: t('themes.textColor'),
  })
  dark.addBinding(darkThemeVars, '--umo-text-color-light', {
    label: t('themes.textColorLight'),
  })
  dark.addBinding(darkThemeVars, '--umo-text-color-disabled', {
    label: t('themes.textColorDisabled'),
  })
  dark.addBinding(darkThemeVars, '--umo-border-color', {
    label: t('themes.borderColor'),
  })
  dark.addBinding(darkThemeVars, '--umo-border-color-dark', {
    label: t('themes.borderColorDark'),
  })
  dark.addBinding(darkThemeVars, '--umo-border-color-light', {
    label: t('themes.borderColorLight'),
  })
  dark.addBinding(darkThemeVars, '--umo-content-text-color', {
    label: t('themes.contentTextColor'),
  })
  dark.addBinding(darkThemeVars, '--umo-scrollbar-thumb-color', {
    label: t('themes.scrollbarThumbColor'),
  })
  dark.addBinding(darkThemeVars, '--umo-scrollbar-thumb-hover-color', {
    label: t('themes.scrollbarThumbHoverColor'),
  })

  tab.on('change', () => {
    const style = document.querySelector('style[umo-editor-theme]')
    style.innerHTML = getThemeCSS('body')
  })

  // 复制配置
  const copyButton = themes.addButton({
    title: t('themes.copy'),
  })
  copyButton.on('click', () => {
    const { copy } = useClipboard({
      source: getThemeCSS(),
    })
    copy()
    useAlert(t('themes.copySuccess'), t('notification'), 'success')
  })
}

onMounted(async () => {
  options = editorRef.getOptions()
  initPane()
})
</script>

<style lang="less">
.config-panel {
  width: 360px;
  position: relative;
  &::before {
    content: '';
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 1px;
    bottom: 0;
    background: var(--umo-border-color);
  }
  .tp-rotv {
    --bs-br: 0;
    --cnt-hp: 6px;
    --cnt-usz: 24px;
    --cnt-vp: 6px;
    --bld-hp: 6px;
    --btn-fg: var(--umo-text-color-light);
    --cnt-bg: var(--umo-button-hover-background);
    --cnt-fg: var(--umo-text-color-light);
    --in-fg: var(--umo-text-color-light);
    --lbl-fg: var(--umo-text-color);
    --tp-base-background-color: var(--umo-color-white);
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
    font-family: Arial, Helvetica, sans-serif;
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
        color: var(--umo-text-color);
      }
    }
  }
  .tp-tabv_t::before {
    height: 1px !important;
    background-color: var(--umo-border-color);
  }
  .tp-fldv_b {
    background: none !important;
    border-bottom: solid 1px var(--umo-border-color);
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
    border: solid 1px var(--umo-border-color);
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
    border: solid 1px var(--umo-border-color);
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
