<template>
  <main class="paged-demo">
    <umo-editor v-if="showEditor" ref="editorRef" v-bind="options">
    </umo-editor>
  </main>
</template>

<script setup>
import { UmoEditor } from '@/paged/umo-editor'
import getOptions from '@/configs/options'

const route = useRoute()

const options = ref({})
const editorRef = ref(null)
const showEditor = ref(false)

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

onMounted(async () => {
  const { query } = route
  // 编辑器
  const defaultOptions = getOptions({
    theme: query.theme || 'light',
    locale: locale.value,
  })
  options.value = {
    ...defaultOptions,
    assistant: {
      enabled: false,
    },
  }
  showEditor.value = true

  // 设置面板
  await nextTick()
})

watch(
  () => route.query,
  (query) => {
    changeLang(query.lang)
    changeTheme(query.theme)
  },
  { deep: true },
)
</script>

<style lang="less" scoped>
.paged-demo {
  position: relative;
  flex: 1;
  min-width: 480px;
}
</style>
