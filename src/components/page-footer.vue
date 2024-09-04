<template>
  <div class="page-footer-slot">
    <div class="left">{{ t('pageFooter.left') }}</div>
    <div class="right">
      {{ t('pageFooter.right', { pageNumber, totalPages }) }}
    </div>
  </div>
</template>

<script setup>
import { t } from '@/composables/i18n'

const props = defineProps({
  pageNumber: {
    type: Number,
    required: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },
})
</script>

<style lang="less" scoped>
.page-footer-slot {
  user-select: none;
  display: flex;
  height: 100%;
  box-sizing: border-box;
  border-top: solid 1px rgba(0, 0, 0, 0.5);
  padding: 10px 0;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 12px;
  color: var(--umo-text-color-light);
}
</style>
