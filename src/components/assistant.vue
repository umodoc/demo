<template>
  <umo-dialog
    :visible="visible"
    icon="assistant"
    :header="t('aiConfig.title')"
    attach="body"
    width="560px"
    :confirm-btn="t('aiConfig.confirm')"
    :cancel-btn="t('aiConfig.cancel')"
    @confirm="onConfirm"
    @close="emits('close')"
  >
    <t-form
      ref="formRef"
      class="form-container"
      :data="formData"
      :rules="rules"
      :label-width="110"
      :show-error-message="false"
      label-align="left"
    >
      <div class="tips" v-html="t('aiConfig.tips')"></div>
      <t-form-item :label="t('aiConfig.aiType')" name="aiType">
        <t-select v-model="aiType">
          <t-option
            v-for="(item, index) in aiTypes"
            :key="index"
            :value="item.value"
            :label="item.label"
          >
            {{ item.label }}
          </t-option>
        </t-select>
      </t-form-item>
      <t-form-item :label="t('aiConfig.baseURL')" name="baseURL">
        <t-input v-model="formData.baseURL" placeholder="" clearable />
      </t-form-item>
      <t-form-item :label="t('aiConfig.apiKey')" name="apiKey">
        <t-input v-model="formData.apiKey" placeholder="" clearable />
      </t-form-item>
      <t-form-item :label="t('aiConfig.model')" name="model">
        <t-input v-model="formData.model" placeholder="" clearable />
      </t-form-item>
    </t-form>
  </umo-dialog>
</template>

<script setup>
import { UmoDialog } from '@umoteam/editor'
import { t } from '@/composables/i18n'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
})
const emits = defineEmits(['close'])

const formRef = ref()
const aiTypes = [
  {
    label: 'DeepSeek',
    value: 'https://api.deepseek.com',
  },
  {
    label: 'OpenAI',
    value: 'https://api.openai.com/v1',
  },
  {
    label: 'Moonshot AI (Kimi)',
    value: 'https://api.moonshot.cn/v1',
  },
  {
    label: '清华智普 (BigModel)',
    value: 'https://open.bigmodel.cn/api/paas/v4/',
  },
  {
    label: '通义千问 (Qwen)',
    value: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
  },
  {
    label: '讯飞星火 (iFLYTEK)',
    value: 'https://spark-api-open.xf-yun.com/v1',
  },
  {
    label: t('aiConfig.customType'),
    value: '',
  },
]
const aiType = ref('')
const formData = ref({
  baseURL: '',
  apiKey: '',
  model: '',
})
const rules = {
  baseURL: [{ required: true, trigger: 'blur' }, { url: true }],
  apiKey: [{ required: true, trigger: 'blur' }],
  model: [{ required: true, trigger: 'blur' }],
}

onMounted(() => {
  try {
    const config = JSON.parse(localStorage.getItem('ai-config'))
    if (config) {
      formData.value = config
    }
  } catch {}
})

const onConfirm = async () => {
  const validate = await formRef.value.validate()
  if (validate !== true) {
    return
  }
  localStorage.setItem('ai-config', JSON.stringify(formData.value))
  emits('close')
}

watch(
  () => aiType.value,
  () => {
    const { value } = aiTypes.find((item) => item.value === aiType.value)
    formData.value.baseURL = value
  },
)
</script>

<style lang="less" scoped>
.tips {
  margin: 5px 0 20px;
  color: var(--umo-error-color);
  text-align: justify;
  font-size: 12px;
  line-height: 1.5;
  padding: 8px 10px;
  border-radius: 3px;
  border: solid 1px var(--umo-error-color);
  background-color: rgba(255, 25, 0, 0.05);
  :deep(p:not(:last-child)) {
    margin-bottom: 5px;
    a {
      color: var(--umo-primary-color);
    }
  }
}
.form-container {
  --td-comp-margin-xxl: 15px;
}
</style>
