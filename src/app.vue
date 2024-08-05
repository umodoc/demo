<template>
  <t-config-provider
    :global-config="{
      ...localeConfig[locale],
    }"
  >
    <div class="demo-container">
      <header class="header-container">
        <header-bar />
      </header>
      <div class="body-container">
        <router-view />
      </div>
    </div>
  </t-config-provider>
</template>

<script setup>
import { locale } from '@/composables/i18n'
import enConfig from 'tdesign-vue-next/esm/locale/en_US'
import cnConfig from 'tdesign-vue-next/esm/locale/zh_CN'

const localeConfig = ref({
  'zh-CN': cnConfig,
  'en-US': enConfig,
})

const route = useRoute()

const setLocale = (lang) => {
  if (!lang) {
    locale.value = navigator.language.split('-')[0] === 'zh' ? 'zh-CN' : 'en-US'
  } else if (lang === 'zh-CN') {
    locale.value = 'zh-CN'
  } else {
    locale.value = 'en-US'
  }
  localStorage.setItem('umo-editor:demo:locale', locale.value)
  localStorage.setItem('umo-editor:default:locale', locale.value)
}

watch(
  () => route.query.lang,
  (value) => {
    setLocale(value)
  },
  {
    immediate: true,
  },
)
</script>

<style lang="less" scoped>
.demo-container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  min-width: 680px;
  min-height: 540px;
  overflow: auto;
  .header-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    border-bottom: solid 1px var(--umo-border-color);
    height: 60px;
    box-sizing: border-box;
    background-color: var(--umo-color-white);
    position: relative;
    color: var(--umo-text-color);
  }
  .body-container {
    display: flex;
    height: calc(100% - 60px);
    box-sizing: border-box;
    overflow: hidden;
    background-color: var(--umo-color-white);
  }
}
</style>
