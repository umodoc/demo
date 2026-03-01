<template>
  <div class="examples">
    <div class="box">
      <umo-editor ref="editorRef" v-bind="options"></umo-editor>
    </div>
    <!-- <div class="box">
      <umo-editor editor-key="testaaa" :toolbar="{ defaultMode: 'classic' }" />
    </div> -->
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Utils / 工具方法
const shortId = (length = 8) =>
  Math.random()
    .toString(36)
    .substring(2, length + 2)

const normalizeLocale = (locale) => {
  const parts = String(locale).replace(/_/g, '-').split('-').filter(Boolean)
  if (parts.length === 0) return ''
  const [language, ...rest] = parts
  const normalized = [language.toLowerCase()]
  for (const part of rest) {
    if (part.length === 2) normalized.push(part.toUpperCase())
    else if (part.length === 4)
      normalized.push(part[0].toUpperCase() + part.slice(1).toLowerCase())
    else normalized.push(part)
  }
  return normalized.join('-')
}

const detectLocale = () => {
  const supported = new Set(['zh-CN', 'en-US'])
  const candidates =
    typeof navigator === 'undefined'
      ? []
      : [...(navigator.languages || []), navigator.language].filter(Boolean)

  for (const candidate of candidates) {
    const normalized = normalizeLocale(candidate)
    if (supported.has(normalized)) return normalized
    const language = normalized.split('-')[0]
    if (language === 'zh') return 'zh-CN'
    if (language === 'en') return 'en-US'
  }

  return 'en-US'
}

const locale = detectLocale()
const tr = (cn, en) => (locale.toLowerCase().startsWith('zh') ? cn : en)

// Templates / 模板数据
const templates = [
  {
    title: tr('工作任务', 'Work Tasks'),
    description: tr('工作任务模板', 'Work task template'),
    content: tr(
      '<h1>工作任务</h1><h3>任务名称：</h3><p>[任务的简短描述]</p><h3>负责人：</h3><p>[执行任务的个人姓名]</p><h3>截止日期：</h3><p>[任务需要完成的日期]</p><h3>任务详情：</h3><ol><li>[任务步骤1]</li><li>[任务步骤2]</li><li>[任务步骤3]...</li></ol><h3>目标：</h3><p>[任务需要达成的具体目标或结果]</p><h3>备注：</h3><p>[任何额外信息或注意事项]</p>',
      '<h1>Work Tasks</h1><h3>Task Name:</h3><p>[A brief description of the task]</p><h3>Owner:</h3><p>[Name of the person responsible]</p><h3>Due Date:</h3><p>[Date the task should be completed]</p><h3>Details:</h3><ol><li>[Step 1]</li><li>[Step 2]</li><li>[Step 3]...</li></ol><h3>Goal:</h3><p>[Specific target outcome]</p><h3>Notes:</h3><p>[Any additional info or considerations]</p>',
    ),
  },
  {
    title: tr('工作周报', 'Weekly Report'),
    description: tr('工作周报模板', 'Weekly report template'),
    content: tr(
      '<h1>工作周报</h1><h2>本周工作总结</h2><hr /><h3>已完成工作：</h3><ul><li>[任务1名称]：[简要描述任务内容及完成情况]</li><li>[任务2名称]：[简要描述任务内容及完成情况]</li><li>...</li></ul><h3>进行中工作：</h3><ul><li>[任务1名称]：[简要描述任务当前进度和下一步计划]</li><li>[任务2名称]：[简要描述任务当前进度和下一步计划]</li><li>...</li></ul><h3>问题与挑战：</h3><ul><li>[问题1]：[描述遇到的问题及当前解决方案或需要的支持]</li><li>[问题2]：[描述遇到的问题及当前解决方案或需要的支持]</li><li>...</li></ul><hr /><h2>下周工作计划</h2><h3>计划开展工作：</h3><ul><li>[任务1名称]：[简要描述下周计划开始的任务内容]</li><li>[任务2名称]：[简要描述下周计划开始的任务内容]</li><li>...</li></ul><h3>需要支持与资源：</h3><ul><li>[资源1]：[描述需要的资源或支持]</li><li>[资源2]：[描述需要的资源或支持]</li><li>...</li></ul>',
      '<h1>Weekly Report</h1><h2>This Week Summary</h2><hr /><h3>Completed:</h3><ul><li>[Task 1]: [What was done and the outcome]</li><li>[Task 2]: [What was done and the outcome]</li><li>...</li></ul><h3>In Progress:</h3><ul><li>[Task 1]: [Current progress and next steps]</li><li>[Task 2]: [Current progress and next steps]</li><li>...</li></ul><h3>Issues & Challenges:</h3><ul><li>[Issue 1]: [Description, current solution or support needed]</li><li>[Issue 2]: [Description, current solution or support needed]</li><li>...</li></ul><hr /><h2>Next Week Plan</h2><h3>Planned Work:</h3><ul><li>[Task 1]: [What you plan to start/do]</li><li>[Task 2]: [What you plan to start/do]</li><li>...</li></ul><h3>Support & Resources Needed:</h3><ul><li>[Resource 1]: [What you need]</li><li>[Resource 2]: [What you need]</li><li>...</li></ul>',
    ),
  },
]

const options = ref({
  locale,
  // theme: 'auto',
  // skin: 'modern',
  toolbar: {
    // defaultMode: 'classic',
    // menus: ['base'],
  },
  document: {
    title: tr('测试文档', 'Test Document'),
    content:
      localStorage.getItem('document.content') || tr('<p>测试文档</p>', '<p>Test document</p>'),
    // structure: 'heading block*',
  },
  page: {
    layouts: ['page', 'web'],
    showBookmark: true,
  },
  templates,
  cdnUrl: 'https://cdn.umodoc.com',
  shareUrl: 'https://www.umodoc.com',
  file: {
    // allowedMimeTypes: [
    //   'application/pdf',
    //   'image/svg+xml',
    //   'video/mp4',
    //   'audio/*',
    // ],
  },
  user: {
    id: 'umoeditor',
    label: 'Umo Editor',
    avatar: 'https://tdesign.gtimg.com/site/avatar.jpg',
  },
  users: [
    { id: 'umodoc', label: 'Umo Team' },
    { id: 'Cassielxd', label: 'Cassielxd' },
    { id: 'Goldziher', label: "Na'aman Hirschfeld" },
    { id: 'SerRashin', label: 'SerRashin' },
    { id: 'ChenErik', label: 'ChenErik' },
    { id: 'china-wangxu', label: 'china-wangxu' },
    { id: 'Sherman Xu', label: 'xuzhenjun130' },
    { id: 'testuser', label: tr('测试用户', 'Test User') },
  ],
  // https://dev.umodoc.com/cn/docs/options/extensions#disableextensions
  disableExtensions: [],
  async onSave(content, page, document) {
    // 将文档和评论线程保存到 localStorage
    localStorage.setItem('document.content', content.html)
    // 模拟保存等待过程
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('onSave', { content, page, document })
        resolve(tr('文档保存成功', 'Document saved successfully'))
      }, 2000)
    })
  },
  async onFileUpload(file) {
    if (!file) {
      throw new Error(tr('没有找到要上传的文件', 'No file found to upload'))
    }
    console.log('onUpload', file)
    await new Promise((resolve) => setTimeout(resolve, 3000))
    return {
      id: shortId(),
      url: file.url || URL.createObjectURL(file),
      name: file.name,
      type: file.type,
      size: file.size,
    }
  },
  onFileDelete(id, url, type) {
    console.log(id, url, type)
  },
})
</script>

<style>
html,
body {
  padding: 0;
  margin: 0;
}
.examples {
  margin: 20px;
  display: flex;
  height: calc(100vh - 40px);
}
.box {
  border: solid 1px #ddd;
  box-sizing: border-box;
  position: relative;
  width: 100%;
  height: 100%;
}

html,
body {
  height: 100vh;
  overflow: hidden;
}
</style>
