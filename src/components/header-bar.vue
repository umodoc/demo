<template>
  <a class="logo" href="/editor">
    <img src="/logo.svg" alt="Umo Editor" />
    |
    <span>
      {{ t('title') }}
      <small>(v{{ pkg.version }})</small>
    </span>
  </a>
  <div v-if="route.path === '/editor'" class="title">
    {{ locale === 'zh-CN' ? '示例文档' : 'Example Document' }}
  </div>
  <div class="actions">
    <a
      class="home"
      :href="`https://${version === 'v4' ? 'v4.' : ''}editor.umodoc.com/${locale === 'zh-CN' ? 'cn' : 'en'}/docs`"
      target="_blank"
    >
      <img src="/home.svg" height="18" />
      {{ t('home') }}
    </a>
    <a
      v-if="route.path === '/editor'"
      :class="{ expand: showPane }"
      @click="showPane = !showPane"
    >
      <img src="/expand.svg" height="18" />
      {{ t('pane') }}
    </a>
    <a>
      <img src="/locale.svg" height="18" />
      <select class="locale-select" v-model="locale">
        <option value="en-US">English</option>
        <option value="zh-CN">简体中文</option>
      </select>
    </a>
    <a>
      <img src="/theme.svg" height="18" />
      <select class="theme-select" v-model="theme">
        <option value="light">{{ t('lightTheme') }}</option>
        <option value="dark">{{ t('darkTheme') }}</option>
        <option value="auto">{{ t('autoTheme') }}</option>
      </select>
    </a>
    <a>
      <img src="/version.svg" height="18" />
      <select class="version-select" v-model="version">
        <option value="v4">{{ t('version4') }}</option>
        <option value="latest">{{ t('versionLatest') }}</option>
      </select>
    </a>
    <a class="github" href="https://github.com/umodoc/editor" target="_blank">
      <img
        src="https://img.shields.io/github/stars/umodoc/editor?style=social"
      />
    </a>
  </div>
</template>

<script setup>
import { t, locale } from '@/composables/i18n'
import pkg from '../../package.json'

const route = useRoute()
const router = useRouter()

const version = ref('latest')
const theme = ref('light')
const showPane = ref(true)

watch(
  () => route.query,
  (query) => {
    if (['light', 'dark', 'auto'].includes(query.theme)) {
      theme.value = query.theme
    }
    showPane.value = query.pane !== 'hide'
  },
  { immediate: true, deep: true },
)

watch(
  () => theme.value,
  (value) => {
    if (route.query.theme !== value) {
      router.replace({
        query: {
          ...route.query,
          theme: value,
        },
      })
    }
  },
)

watch(
  () => showPane.value,
  (value) => {
    router.replace({
      query: {
        ...route.query,
        pane: value ? 'options' : 'hide',
      },
    })
  },
)

watch(
  () => locale.value,
  (value) => {
    if (route.query.lang !== value) {
      router.replace({
        query: {
          ...route.query,
          lang: value,
        },
      })
    }
  },
)

watch(
  () => version.value,
  (v) => {
    const urlParams = new URLSearchParams(window.location.search).toString()
    if (v === 'v4') {
      location.href = `https://v4.demo.umodoc.com/editor${urlParams !== '' ? `?${urlParams}` : ''}`
    }
  },
)
</script>

<style lang="less" scoped>
a {
  text-decoration: none;
}
.logo {
  display: flex;
  color: var(--umo-border-color);
  &:hover {
    opacity: 0.8;
  }
  img {
    height: 24px;
    margin-top: -3px;
    margin-right: 20px;
  }
  span {
    color: var(--umo-text-color);
    font-size: 18px;
    margin-left: 15px;
  }
}
.title {
  max-width: calc(100vw - 800px);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  @media screen and (max-width: 1200px) {
    display: none;
  }
}
.actions {
  display: flex;
  align-items: center;
  gap: 20px;
  user-select: none;
  a {
    display: flex;
    align-items: center;
    font-size: 14px;
    color: var(--umo-text-color-light);
    font-weight: 600;
    cursor: pointer;
    &:hover {
      color: var(--umo-text-color);
    }
    &.github {
      @media screen and (max-width: 1200px) {
        display: none;
      }
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
  select {
    border: none;
    outline: none;
    margin-left: -5px;
    font-size: 14px;
    color: var(--umo-text-color-light);
    font-weight: 600;
    background-color: transparent;
  }
}
</style>
