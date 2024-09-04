<template>
  <div class="page-header-slot">
    <div class="left" v-html="t('pageHeader')"></div>
    <div class="right">
      <img :src="`/qrcode-${locale === 'zh-CN' ? 'cn' : 'en'}.svg`" />
    </div>
  </div>
</template>

<script setup>
import { t, locale } from '@/composables/i18n'
</script>

<style lang="less" scoped>
.page-header-slot {
  user-select: none;
  display: flex;
  height: 100%;
  box-sizing: border-box;
  border-bottom: solid 1px rgba(0, 0, 0, 0.5);
  padding-bottom: 10px;
  align-items: flex-end;
  justify-content: space-between;
  .left {
    font-size: 12px;
    color: var(--umo-text-color-light);
  }
  .right {
    img {
      display: block;
      height: 42px;
    }
  }
}
</style>
