<template>
  <main class="editor-container">
    <umo-editor
      v-if="showEditor"
      ref="editorRef"
      v-bind="options"
      @before-create="events.onBeforeCreate"
      @created="events.onCreated"
      @changed="events.onChanged"
      @changed:selection="events.onChangedSelection"
      @changed:transaction="events.onChangedTransaction"
      @changed:menu="events.onChangedMenu"
      @changed:toolbar="events.onChangedToolbar"
      @changed:page-size="events.onChangedPageSize"
      @changed:page-orientation="events.onChangedPageOrientation"
      @changed:page-margin="events.onChangedPageMargin"
      @changed:page-background="events.onChangedPageBackground"
      @changed:page-zoom="events.onChangedZoom"
      @changed:page-show-toc="events.onChangedPageShowToc"
      @changed:page-preview="events.onChangedpreview"
      @changed:page-watermark="events.onChangedPageWatermark"
      @changed:locale="events.onChangedLocale"
      @changed:theme="events.onChangedTheme"
      @content-error="events.onContentError"
      @print="events.onPrint"
      @focus="events.onFocus"
      @blur="events.onBlur"
      @saved="events.onSaved"
      @destroy="events.onDestroy"
    >
      <template #toolbar_base>
        <umo-menu-button
          class="menu-button-demo"
          :ico="demoIcon"
          :text="t('slotDemo')"
          huge
          @menu-click="openButtonMenuButton"
        />
      </template>
      <template #bubble_menu>
        <umo-menu-button
          :ico="demoIcon"
          :text="t('slotDemo')"
          @menu-click="openButtonMenuButton"
        />
      </template>
      <template #page_header>
        <page-header />
      </template>
      <template #page_footer="props">
        <page-footer v-bind="props" />
      </template>
    </umo-editor>
    <assistant :visible="aiConfigVisible" @close="closeAiConfig" />
  </main>
  <aside v-if="showPane" id="config-panel" class="config-panel">
    <config-panel
      :editor-ref="editorRef"
      :default-active="paneActive"
      @change-lang="changeLang"
      @change-theme="changeTheme"
      @reset-editor="resetEditor"
    />
  </aside>
</template>

<script setup>
import { UmoMenuButton } from '@umoteam/editor'
import OpenAI from 'openai'
import { t, locale } from '@/composables/i18n'
import getOptions from '@/configs/options'
import events from '@/configs/events'

const route = useRoute()

const options = ref({ document: {} })
const editorRef = ref(null)
const showEditor = ref(false)
const showPane = ref(false)
const paneActive = ref(0)

// 设置语言
const changeLang = (lang) => {
  if (['zh-CN', 'en-US'].includes(lang)) {
    locale.value = lang
    editorRef.value.setLocale(lang)
  }
}

// 改变主题
const changeTheme = (theme) => {
  if (['light', 'dark', 'auto'].includes(theme)) {
    editorRef.value.setTheme(theme)
  }
}

// 设置面板
const togglePane = (pane) => {
  showPane.value = pane !== 'hide'
  let active = 'options'
  const paneTabs = ['options', 'events', 'themes']
  if (pane && paneTabs.includes(pane)) {
    active = pane
    showPane.value = true
  }
  paneActive.value = paneTabs.findIndex((item) => item === active)
}

// 重新加载编辑器
const resetEditor = async () => {
  showEditor.value = false
  await nextTick()
  showEditor.value = true
}

// AI 设置
const aiConfigVisible = ref(false)
const closeAiConfig = () => {
  aiConfigVisible.value = false
}
const onAssistantMessage = async (payload, content) => {
  console.log('onMessage', { payload, content })
  let config = {}
  const showErrorDialog = () => {
    const dialog = editorRef.value.useAlert({
      theme: 'danger',
      header: t('notification'),
      body: t('aiConfig.error'),
      confirmBtn: locale.value === 'zh-CN' ? '确定' : 'Ok',
      onConfirm() {
        dialog.destroy()
        aiConfigVisible.value = true
      },
    })
  }
  try {
    const aiConfig = localStorage.getItem('ai-config')
    if (aiConfig === null) {
      showErrorDialog()
      return
    }
    config = JSON.parse(aiConfig)
  } catch {
    showErrorDialog()
    return
  }
  const { command, lang, input, output } = payload
  const langs = {
    'en-US': '英文',
    'zh-CN': '中文',
  }
  const options = {
    stream: true,
    model: config.model,
    messages: [
      {
        role: 'system',
        content: `你是一个文档助手，根据用户输入的文本或者HTML内容，以及对应操作指令，生成符合要求的文档内容。要求如下：1.如果指令不是要求翻译内容，请使用${langs[lang]}返回，否则按用户要求翻译的语言返回；2.返回${output === 'rich-text' ? '富文本（HTML）' : '纯文本（剔除内容中的HTML标记）'}格式；3.如果用户输入的指令你不能理解，在返回的内容前加上“[ERROR]: ”，4.除此之外不返回任何其他多余的内容。`,
      },
      {
        role: 'user',
        content: `对以下内容进行：【${command}】操作。\n${input}`,
      },
    ],
  }
  try {
    const client = new OpenAI({
      baseURL: config.baseURL,
      apiKey: config.apiKey,
      dangerouslyAllowBrowser: true, // 允许在浏览器中使用 OpenAI SDK
    })
    const completion = await client.chat.completions.create(options)
    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of completion) {
          controller.enqueue(chunk.choices[0]?.delta?.content || '')
        }
        controller.close()
      },
    })
    return stream
  } catch (error) {
    console.error(error)
    showErrorDialog()
  }
}

onMounted(async () => {
  const { query } = route
  // 编辑器
  const defaultOptions = getOptions({
    theme: query.theme || 'light',
    locale: locale.value,
  })
  options.value = {
    ...defaultOptions,
    // 用户列表
    users: [
      { id: 'umodoc', label: 'Umo Team' },
      { id: 'Cassielxd', label: 'Cassielxd' },
      { id: 'Goldziher', label: "Na'aman Hirschfeld" },
      { id: 'SerRashin', label: 'SerRashin' },
      { id: 'ChenErik', label: 'ChenErik' },
      { id: 'china-wangxu', label: 'china-wangxu' },
      { id: 'Sherman Xu', label: 'xuzhenjun130' },
      { id: 'testuser', label: '测试用户' },
    ],
    // AI 文档助手
    ai: {
      assistant: {
        onMessage: onAssistantMessage,
      },
    },
  }
  showEditor.value = true

  // 设置面板
  await nextTick()
  togglePane(query.pane)
})

watch(
  () => route.query,
  (query) => {
    changeLang(query.lang)
    changeTheme(query.theme)
    togglePane(query.pane)
  },
  { deep: true },
)

// 自定义插槽演示
const demoIcon = `<svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 6H8a2 2 0 0 0-2 2v8M16 42H8a2 2 0 0 1-2-2v-8M32 42h8a2 2 0 0 0 2-2v-8M32 6h8a2 2 0 0 1 2 2v8M32 24H16M24 32V16" stroke="var(--umo-error-color)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>`

const openButtonMenuButton = () => {
  const dialog = editorRef.value.useAlert({
    theme: 'info',
    header: t('notification'),
    body: t('slotDemoDesc'),
    confirmBtn: locale.value === 'zh-CN' ? '确定' : 'Ok',
    onConfirm() {
      dialog.destroy()
    },
  })
}
</script>

<style lang="less" scoped>
.editor-container {
  position: relative;
  flex: 1;
  min-width: 480px;
}
</style>
<style lang="less">
.menu-button-demo {
  .text {
    color: var(--umo-error-color) !important;
  }
}
</style>
