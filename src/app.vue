<template>
  <div class="demo-container">
    <header class="header-container">
      <a class="logo" href="https://editor.umodoc.com/docs">
        <img src="/logo.svg" alt="Umo Editor" />
        | <span v-text="t('title')"></span>
      </a>
      <div class="title">
        {{ locale === 'zh-CN' ? '示例文档' : 'Example Document' }}
      </div>
      <div class="actions">
        <!-- <a
          class="github"
          href="https://github.com/umodoc/editor"
          target="_blank"
        >
          <img
            src="https://img.shields.io/github/stars/umodoc/editor?style=social"
            height="22"
          />
        </a> -->
        <a
          class="home"
          :href="`https://editor.umodoc.com/${locale === 'zh-CN' ? 'cn' : 'en'}/docs`"
        >
          <img src="/home.svg" height="18" />
          {{ t('home') }}
        </a>
        <a :class="{ expand: showPane }" @click="showPane = !showPane">
          <img src="/expand.svg" height="18" />
          {{ t('pane') }}
        </a>
        <a>
          <img src="/locale.svg" height="18" />
          <select class="locale-select" v-model="locale" @change="changeLang">
            <option value="en-US">English</option>
            <option value="zh-CN">简体中文</option>
          </select>
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
          @changed:locale="onChangedLocale"
          @print="onPrint"
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
import { useI18n } from 'vue-i18n'
import { UmoEditor } from '@umoteam/editor'
import { Pane } from 'tweakpane'
import { useClipboard } from '@vueuse/core'

const { t, locale } = useI18n()

let defaultOptions = {}
const l = (data) => {
  const lang = locale.value.replace('-', '_')
  if (typeof data === 'string') {
    return data
  }
  if (typeof data === 'object') {
    return data[lang]
  }
}
const templates = {
  'zh-CN': [
    {
      title: '工作任务',
      description: '工作任务模板',
      content: `<h1>工作任务</h1><h3>任务名称：</h3><p>[任务的简短描述]</p><h3>负责人：</h3><p>[执行任务的个人姓名]</p><h3>截止日期：</h3><p>[任务需要完成的日期]</p><h3>任务详情：</h3><ol><li>[任务步骤1]</li><li>[任务步骤2]</li><li>[任务步骤3]...</li></ol><h3>目标：</h3><p>[任务需要达成的具体目标或结果]</p><h3>备注：</h3><p>[任何额外信息或注意事项]</p>`,
    },
    {
      title: '工作周报',
      description: '工作周报模板',
      content: `<h1>工作周报</h1><h2>本周工作总结</h2><hr /><h3>已完成工作：</h3><ul><li>[任务1名称]：[简要描述任务内容及完成情况]</li><li>[任务2名称]：[简要描述任务内容及完成情况]</li><li>...</li></ul><h3>进行中工作：</h3><ul><li>[任务1名称]：[简要描述任务当前进度和下一步计划]</li><li>[任务2名称]：[简要描述任务当前进度和下一步计划]</li><li>...</li></ul><h3>问题与挑战：</h3><ul><li>[问题1]：[描述遇到的问题及当前解决方案或需要的支持]</li><li>[问题2]：[描述遇到的问题及当前解决方案或需要的支持]</li><li>...</li></ul><hr /><h2>下周工作计划</h2><h3>计划开展工作：</h3><ul><li>[任务1名称]：[简要描述下周计划开始的任务内容]</li><li>[任务2名称]：[简要描述下周计划开始的任务内容]</li><li>...</li></ul><h3>需要支持与资源：</h3><ul><li>[资源1]：[描述需要的资源或支持]</li><li>[资源2]：[描述需要的资源或支持]</li><li>...</li></ul>`,
    },
  ],
  'en-US': [
    {
      title: 'Task Assignment',
      description: 'Task Assignment Template',
      content: `<h1>Task Assignment</h1><h3>Task Name:</h3><p>[Brief description of the task]</p><h3>Responsible Party:</h3><p>[Name of the individual executing the task]</p><h3>Due Date:</h3><p>[Date the task needs to be completed by]</p><h3>Task Details:</h3><ol><li>[Step 1 of the task]</li><li>[Step 2 of the task]</li><li>[Step 3 of the task]...</li></ol><h3>Objective:</h3><p>[Specific goal or outcome the task aims to achieve]</p><h3>Notes:</h3><p>[Any additional information or notes]</p>`,
    },
    {
      title: 'Weekly Work Report',
      description: 'Weekly Work Report Template',
      content: `<h1>Weekly Work Report</h1><h2>Summary of This Week's Work</h2><hr /><h3>Completed Tasks:</h3><ul><li>[Task 1 Name]: [Briefly describe the task and completion status]</li><li>[Task 2 Name]: [Briefly describe the task and completion status]</li><li>...</li></ul><h3>Ongoing Tasks:</h3><ul><li>[Task 1 Name]: [Briefly describe the current progress and next steps]</li><li>[Task 2 Name]: [Briefly describe the current progress and next steps]</li><li>...</li></ul><h3>Challenges & Issues:</h3><ul><li>[Issue 1]: [Describe the issue and current solution or needed support]</li><li>[Issue 2]: [Describe the issue and current solution or needed support]</li><li>...</li></ul><hr /><h2>Next Week's Work Plan</h2><h3>Scheduled Tasks:</h3><ul><li>[Task 1 Name]: [Briefly describe the task content planned for next week]</li><li>[Task 2 Name]: [Briefly describe the task content planned for next week]</li><li>...</li></ul><h3>Needed Support & Resources:</h3><ul><li>[Resource 1]: [Describe the required resource or support]</li><li>[Resource 2]: [Describe the required resource or support]</li><li>...</li></ul>`,
    },
  ],
}
const content = {
  'zh-CN':
    '<img type="image" src="https://editor.umodoc.com/images/logo.svg" width="381.19417475728153" height="71" left="0" top="0" draggable="false" rotatable="false" equalproportion="true" flipx="false" flipy="false" uploaded="false" error="false"><p></p><h2 style="line-height: 2" id="85l9io" data-toc-id="85l9io"><b>基本介绍</b></h2><p style="line-height: 1.75rem">Umo Editor 是一个基于 Vue3 适合于国人使用的本土化开源文档编辑器。Umo Editor 提供完善的文档编辑能力，支持 Markdown 语法，支持基础的富文本编辑功能，支持多种插入多种格式的节点类型、提供了多种类型的实用工具，并支持设置页面的样式，支持导出多种类型的格式，支持打印和打印预览，支持文档块编辑，支持添加自定义扩展，支持多语言设置。</p><img type="image" src="https://editor.umodoc.com/images/umo-editor@2x.png" left="0" top="0" draggable="false" rotatable="false" equalproportion="true" flipx="false" flipy="false" uploaded="false" error="false"><p style="line-height: 1.75rem">作为一个独立的 Vue3 插件，Umo Editor 可以零配置轻松集成到各类 Vue3 项目中，对于非 Vue3 项目，您可以通过 Iframe 将 Umo Editor 嵌入到您的项目中。</p><p style="line-height: 1.75rem"><a target="_blank" rel="noreferrer" href="https://editor.umodoc.com/docs">开发文档</a> | <a target="_blank" rel="noreferrer" href="https://demo.umodoc.com/editor">在线演示</a> | <a target="_blank" rel="noreferrer" href="https://github.com/umodoc/editor">GitHub</a> | <a target="_blank" rel="noreferrer" href="https://gitee.com/umodoc/editor">码云(国内镜像)</a> | <a target="_blank" rel="noreferrer" href="https://www.npmjs.com/package/@umoteam/editor">NPM</a></p><h2 style="line-height: 2" id="51iw3u" data-toc-id="51iw3u"><b>在线体验</b></h2><p style="line-height: 1.75rem">访问 <a target="_blank" rel="noopener noreferrer nofollow" href="https://demo.umodoc.com/editor?pane=no">https://demo.umodoc.com/editor?pane=no</a> 快速体验。</p><h2 style="line-height: 2" id="3t5soy" data-toc-id="3t5soy"><b>开发文档</b></h2><p style="line-height: 1.75rem">请访问 <a target="_blank" rel="noopener noreferrer nofollow" href="https://editor.umodoc.com/docs">https://editor.umodoc.com/docs</a> 。</p><h2 style="line-height: 2" id="fgb3fr" data-toc-id="fgb3fr"><b>设计理念</b></h2><p style="line-height: 1.75rem">Umo Editor 的诞生，旨在解决 Web 应用中文档编辑的复杂性，为 Web 项目提供开源免费的类似 Office Word 的强大编辑能力和协同能力，同时保持 Web 应用的便捷性。无论是政企信息管理系统、学术研究撰写、团队文档协作、知识库管理还是个人笔记整理，Umo Editor 都能成为您得力的助手。</p><h2 style="line-height: 2" id="wv3owd" data-toc-id="wv3owd"><b>开源优势</b></h2><ul style="list-style-type: disc"><li><p style="line-height: 1.75rem"><b>免费使用</b>：作为开源项目，Umo Editor 基于 <a target="_blank" rel="noreferrer" href="https://github.com/umo-editor/umo-editor/blob/main/LICENSE">MIT 许可证</a> 对所有开发者免费开放，无需担心版权问题。</p></li><li><p style="line-height: 1.75rem"><b>持续更新</b>：Umo Editor 将持续迭代，不断优化功能，提升用户体验。</p></li><li><p style="line-height: 1.75rem"><b>定制化开发</b>：开源意味着更大的灵活性，开发者可根据项目需求进行定制化开发，打造专属的文档编辑器。</p></li></ul><h2 style="line-height: 2" id="enrnmz" data-toc-id="enrnmz"><b>核心特性</b></h2><ul style="list-style-type: disc"><li><p>零配置开箱即用</p></li><li><p>轻量级</p></li><li><p>支持自定义扩展</p></li><li><p>全过程所见即所得</p></li><li><p>富文本编辑功能</p></li><li><p>Markdown 语法支持</p></li><li><p>实用工具集成</p></li><li><p>演示模式</p></li><li><p>文档导出与分享</p></li><li><p>页面设置</p></li><li><p>支持打印及打印预览</p></li><li><p>气泡菜单与块级菜单</p></li><li><p>快捷键支持</p></li><li><p>主题定制</p></li><li><p>多语言支持</p></li></ul><p style="line-height: 1.75rem">更多详细介绍见 <a target="_blank" rel="noopener noreferrer nofollow" href="https://editor.umodoc.com/docs/features">核心特性</a>。</p><h2 style="line-height: 2" id="f5b8vq" data-toc-id="f5b8vq"><b>浏览器支持</b></h2><table style="minWidth: 75px"><colgroup><col><col><col></colgroup><tbody><tr><th colspan="1" rowspan="1"><p><b>浏览器</b></p></th><th colspan="1" rowspan="1"><p><b>版本</b></p></th><th colspan="1" rowspan="1"><p><b>支持情况</b></p></th></tr><tr><td colspan="1" rowspan="1"><p>Google Chrome</p></td><td colspan="1" rowspan="1"><p>最新版</p></td><td colspan="1" rowspan="1"><p>✅ 支持</p></td></tr><tr><td colspan="1" rowspan="1"><p>Firefox</p></td><td colspan="1" rowspan="1"><p>最新版</p></td><td colspan="1" rowspan="1"><p>✅ 支持</p></td></tr><tr><td colspan="1" rowspan="1"><p>Safari</p></td><td colspan="1" rowspan="1"><p>最新版</p></td><td colspan="1" rowspan="1"><p>✅ 支持</p></td></tr><tr><td colspan="1" rowspan="1"><p>Microsoft Edge</p></td><td colspan="1" rowspan="1"><p>最新版</p></td><td colspan="1" rowspan="1"><p>✅ 支持</p></td></tr><tr><td colspan="1" rowspan="1"><p>360 极速浏览器</p></td><td colspan="1" rowspan="1"><p>最新版</p></td><td colspan="1" rowspan="1"><p>✅ 支持</p></td></tr><tr><td colspan="1" rowspan="1"><p>各类国产浏览器的极速模式</p></td><td colspan="1" rowspan="1"><p>最新版</p></td><td colspan="1" rowspan="1"><p>✅ 支持</p></td></tr><tr><td colspan="1" rowspan="1"><p>Internet Explorer (IE)</p></td><td colspan="1" rowspan="1"><p>所有</p></td><td colspan="1" rowspan="1"><p>❌ 不支持</p></td></tr></tbody></table><h2 style="line-height: 2" id="bhgzg4" data-toc-id="bhgzg4"><b>Nodejs 版本支持</b></h2><p style="line-height: 1.75rem">Nodejs 18.0.0 及以上版本。</p><h2 style="line-height: 2" id="2eky6x" data-toc-id="2eky6x"><b>加入社区</b></h2><p style="line-height: 1.75rem">我们鼓励用户加入 Umo Editor 的开源社区，共同参与到产品的开发和改进中来。无论是提交 Bug 报告、功能请求还是代码贡献，都是我们社区宝贵的一部分。</p><p style="line-height: 1.75rem">您可以通过 <a target="_blank" rel="noopener noreferrer nofollow" href="https://github.com/umodoc/editor/discussions">https://github.com/umodoc/editor/discussions</a> 提交问题或意见。</p><p style="line-height: 1.75rem">或通过 <a target="_blank" rel="noopener noreferrer nofollow" href="https://github.com/umodoc/editor/issues">https://github.com/umodoc/editor/issues</a> 提交 Bug 报告。</p><h2 style="line-height: 2" id="c3nctg" data-toc-id="c3nctg"><b>贡献代码</b></h2><p style="line-height: 1.75rem">我们欢迎任何形式的贡献，包括但不限于提交 Bug 报告、功能请求、代码贡献等。</p><h2 style="line-height: 2" id="sxtgyp" data-toc-id="sxtgyp"><b>联系我们</b></h2><p style="line-height: 1.75rem">如果您有任何疑问或建议，请通过以下方式联系我们，在此之前，建议您详细阅读本文档，以便您了解如何使用 Umo Editor。</p><ul style="list-style-type: disc"><li><p>反馈：<a target="_blank" rel="noopener noreferrer nofollow" href="https://github.com/umodoc/editor/issues">https://github.com/umodoc/editor/issues</a> | <a target="_blank" rel="noopener noreferrer nofollow" href="https://gitee.com/umodoc/editor/issues">https://gitee.com/umodoc/editor/issues</a></p></li><li><p>社区：<a target="_blank" rel="noopener noreferrer nofollow" href="https://github.com/umodoc/editor/discussions">https://github.com/umodoc/editor/discussions</a></p></li><li><p><a target="_blank" rel="noopener noreferrer nofollow" href="mailto:邮件：contact@umoteam.com">邮件：contact@umoteam.com</a></p></li></ul><h2 style="line-height: 2" id="i78zf1" data-toc-id="i78zf1"><b>支持我们</b></h2><p style="line-height: 1.75rem">如果您觉得 Umo Editor 有用，请考虑通过以下方式支持我们：</p><ul style="list-style-type: disc"><li><p>⭐ 给 <a target="_blank" rel="noreferrer" href="https://github.com/umodoc/editor">Umo Editor 仓库</a> 点个 Star，表示对项目的支持。</p></li><li><p>🔗 如果您在项目中使用了 Umo Editor，请添加一个链接到 <a target="_blank" rel="noopener noreferrer nofollow" href="https://github.com/umodoc/editor">https://github.com/umodoc/editor</a> 。</p></li></ul><h2 style="line-height: 2" id="55qdrs" data-toc-id="55qdrs"><b>定制开发</b></h2><p style="line-height: 1.75rem">如果您需要定制化开发，请联系我们，我们可以提供付费的定制化解决方案。</p><h2 style="line-height: 2" id="i5k15f" data-toc-id="i5k15f"><b>开源协议</b></h2><p style="line-height: 1.75rem">Umo Editor 采用 <a target="_blank" rel="noreferrer" href="https://github.com/umodoc/editor/blob/main/LICENSE">MIT 许可证</a>，您可以免费使用、修改和使用本软件。</p><p style="line-height: 1.75rem">本文档采用 <a target="_blank" rel="noreferrer" href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh-hans">CC BY-NC-SA 4.0 DEED 许可证</a> 发布。</p>',
  'en-US':
    '<img type="image" src="https://editor.umodoc.com/images/logo.svg" width="381.19417475728153" height="71" left="0" top="0" draggable="false" rotatable="false" equalproportion="true" flipx="false" flipy="false" uploaded="false" error="false"><p></p><h1 style="text-align: start" id="td3bxo" data-toc-id="td3bxo"><b>Introduction</b></h1><p style="text-align: start; line-height: 1.75rem">Umo Editor is an open-source document editor based on Vue3, offering localized functionalities. It provides comprehensive document editing capabilities, supports Markdown syntax, basic rich-text editing features, a variety of node types in multiple formats, a range of practical tools, and customization of page styles. It also supports exporting in various formats, printing and print preview, document block editing, adding custom extensions, and i18n settings.</p><img type="image" src="https://editor.umodoc.com/images/umo-editor@2x.png" width="553" height="421" left="0" top="0" draggable="false" rotatable="false" equalproportion="true" flipx="false" flipy="false" uploaded="false" error="false"><p style="text-align: start; line-height: 1.75rem">As a standalone Vue3 plugin, Umo Editor can be easily integrated into any Vue3 project with zero configuration. For non-Vue3 projects, you can embed Umo Editor using an Iframe.</p><p style="text-align: start; line-height: 1.75rem"><a target="_blank" rel="noreferrer" class="_text-primary-600 _underline _decoration-from-font [text-underline-position:from-font]" href="https://editor.umodoc.com/en/docs">Documentation</a> | <a target="_blank" rel="noreferrer" class="_text-primary-600 _underline _decoration-from-font [text-underline-position:from-font]" href="https://editor.umodoc.com/cn/docs">中文文档</a> | <a target="_blank" rel="noreferrer" class="_text-primary-600 _underline _decoration-from-font [text-underline-position:from-font]" href="https://demo.umodoc.com/editor?lang=en">Live Demo</a> | <a target="_blank" rel="noreferrer" class="_text-primary-600 _underline _decoration-from-font [text-underline-position:from-font]" href="https://github.com/umodoc/editor">GitHub</a> | <a target="_blank" rel="noreferrer" class="_text-primary-600 _underline _decoration-from-font [text-underline-position:from-font]" href="https://www.npmjs.com/package/@umoteam/editor">NPM</a></p><h2 style="text-align: start; line-height: 2" id="grljqh" data-toc-id="grljqh"><b>Online Experience</b></h2><p style="text-align: start; line-height: 1.75rem">Visit <a target="_blank" rel="noreferrer" class="_text-primary-600 _underline _decoration-from-font [text-underline-position:from-font]" href="https://demo.umodoc.com/editor?pane=no&amp;lang=en">Playground</a> for a fast experience.</p><h2 style="text-align: start; line-height: 2" id="ozr47n" data-toc-id="ozr47n"><b>Documentation</b></h2><p style="text-align: start; line-height: 1.75rem">Please visit <a target="_blank" rel="noreferrer" class="_text-primary-600 _underline _decoration-from-font [text-underline-position:from-font]" href="https://editor.umodoc.com/en/docs">Documentation</a>.</p><h2 style="text-align: start; line-height: 2" id="m4sld9" data-toc-id="m4sld9"><b>Design Philosophy</b></h2><p style="text-align: start; line-height: 1.75rem">Umo Editor was created to address the complexity of document editing in web applications, providing web projects with open-source and powerful editing and collaborative capabilities similar to Office Word, while maintaining the convenience of web applications. Whether it’s government and enterprise information management systems, academic research writing, team document collaboration, knowledge base management, or personal note organization, Umo Editor can be a powerful assistant.</p><h2 style="text-align: start; line-height: 2" id="m6qra8" data-toc-id="m6qra8"><b>Open Source Advantages</b></h2><ul style="list-style-type: disc"><li><p style="line-height: 1.75rem"><b>Free to Use</b>: As an open-source project, Umo Editor is freely available to all developers under the <a target="_blank" rel="noreferrer" class="_text-primary-600 _underline _decoration-from-font [text-underline-position:from-font]" href="https://github.com/umo-editor/umo-editor/blob/main/LICENSE">MIT License</a>, with no copyright concerns.</p></li><li><p style="line-height: 1.75rem"><b>Continuous Updates</b>: Umo Editor will continue to iterate, constantly optimizing features and enhancing user experience.</p></li><li><p style="line-height: 1.75rem"><b>Customizable Development</b>: Open source means greater flexibility. Developers can customize the development according to project needs to create a unique document editor.</p></li></ul><h2 style="text-align: start; line-height: 2" id="x68on1" data-toc-id="x68on1"><b>Core Features</b></h2><ul style="list-style-type: disc"><li><p>Zero-config out-of-the-box usability</p></li><li><p>Lightweight</p></li><li><p>WYSIWYG (What You See Is What You Get) throughout the process</p></li><li><p>Rich-text editing capabilities</p></li><li><p>Markdown syntax support</p></li><li><p>Integrated practical tools</p></li><li><p>Presentation mode</p></li><li><p>Document export and sharing</p></li><li><p>Page settings</p></li><li><p>Support for printing and print preview</p></li><li><p>Support for custom plugins</p></li><li><p>Shortcut key support</p></li><li><p>Theme customization</p></li><li><p>Multi-language settings</p></li></ul><p style="text-align: start; line-height: 1.75rem">For more detailed introductions, see <a target="_blank" rel="noopener noreferrer nofollow" class="_text-primary-600 _underline _decoration-from-font [text-underline-position:from-font]" href="http://localhost:9002/en/docs/features">Core Features</a>.</p><h2 style="text-align: start; line-height: 2" id="ru4iz5" data-toc-id="ru4iz5"><b>Browser Support</b></h2><table style="minWidth: 75px"><colgroup><col><col><col></colgroup><tbody><tr><th colspan="1" rowspan="1"><p><b>Browser</b></p></th><th colspan="1" rowspan="1"><p><b>Version</b></p></th><th colspan="1" rowspan="1"><p><b>Support</b></p></th></tr><tr><td colspan="1" rowspan="1"><p>Google Chrome</p></td><td colspan="1" rowspan="1"><p>Latest</p></td><td colspan="1" rowspan="1"><p>✅</p></td></tr><tr><td colspan="1" rowspan="1"><p>Firefox</p></td><td colspan="1" rowspan="1"><p>Latest</p></td><td colspan="1" rowspan="1"><p>✅</p></td></tr><tr><td colspan="1" rowspan="1"><p>Safari</p></td><td colspan="1" rowspan="1"><p>Latest</p></td><td colspan="1" rowspan="1"><p>✅</p></td></tr><tr><td colspan="1" rowspan="1"><p>Microsoft Edge</p></td><td colspan="1" rowspan="1"><p>Latest</p></td><td colspan="1" rowspan="1"><p>✅</p></td></tr><tr><td colspan="1" rowspan="1"><p>Internet Explorer (IE)</p></td><td colspan="1" rowspan="1"><p>All</p></td><td colspan="1" rowspan="1"><p>❌</p></td></tr></tbody></table><h2 style="text-align: start; line-height: 2" id="mtrzq3" data-toc-id="mtrzq3"><b>Node.js Version Support</b></h2><p style="text-align: start; line-height: 1.75rem">Node.js 18.0.0 or above.</p><h2 style="text-align: start; line-height: 2" id="hdab7y" data-toc-id="hdab7y"><b>Join the Community</b></h2><p style="text-align: start; line-height: 1.75rem">We encourage users to join the Umo Editor open-source community and participate in the development and improvement of the product. Whether submitting bug reports, feature requests, or code contributions, all are valuable parts of our community.</p><p style="text-align: start; line-height: 1.75rem">You can submit issues or suggestions via <a target="_blank" rel="noopener noreferrer nofollow" href="https://github.com/umodoc/editor/discussions">https://github.com/umodoc/editor/discussions</a>.</p><p style="text-align: start; line-height: 1.75rem">Or submit bug reports via <a target="_blank" rel="noopener noreferrer nofollow" href="https://github.com/umodoc/editor/issues">https://github.com/umodoc/editor/issues</a>.</p><h2 style="text-align: start; line-height: 2" id="o5shhk" data-toc-id="o5shhk"><b>Contribute Code</b></h2><p style="text-align: start; line-height: 1.75rem">We welcome any form of contribution, including but not limited to submitting bug reports, feature requests, and code contributions.</p><h2 style="text-align: start; line-height: 2" id="nvu0c6" data-toc-id="nvu0c6"><b>Contact Us</b></h2><p style="text-align: start; line-height: 1.75rem">If you have any questions or suggestions, please contact us through the following methods. Before that, it is recommended to read this document carefully to understand how to use Umo Editor.</p><ul style="list-style-type: disc"><li><p>Feedback: <a target="_blank" rel="noopener noreferrer nofollow" href="https://github.com/umodoc/editor/issues">https://github.com/umodoc/editor/issues</a></p></li><li><p>Community: <a target="_blank" rel="noopener noreferrer nofollow" href="https://github.com/umodoc/editor/discussions">https://github.com/umodoc/editor/discussions</a></p></li><li><p>Email: <a target="_blank" rel="noopener noreferrer nofollow" href="mailto:contact@umoteam.com">contact@umoteam.com</a></p></li></ul><h2 style="text-align: start; line-height: 2" id="kyks3s" data-toc-id="kyks3s"><b>Support Us</b></h2><p style="text-align: start; line-height: 1.75rem">If you find Umo Editor useful, please consider supporting us in the following ways:</p><ul style="list-style-type: disc"><li><p>⭐ Star the <a target="_blank" rel="noreferrer" class="_text-primary-600 _underline _decoration-from-font [text-underline-position:from-font]" href="https://github.com/umodoc/editor">Umo Editor Repository</a> to show your support for the project.</p></li><li><p>🔗 If you use Umo Editor in your project, please add a link to <a target="_blank" rel="noopener noreferrer nofollow" href="https://github.com/umodoc/editor">https://github.com/umodoc/editor</a>.</p></li></ul><h2 style="text-align: start; line-height: 2" id="h2xfpo" data-toc-id="h2xfpo"><b>Open Source License</b></h2><p style="text-align: start; line-height: 1.75rem">Umo Editor is licensed under the <a target="_blank" rel="noreferrer" class="_text-primary-600 _underline _decoration-from-font [text-underline-position:from-font]" href="https://github.com/umodoc/editor/blob/main/LICENSE">MIT License</a>, allowing you to use, modify, and distribute the software freely.</p><p style="text-align: start; line-height: 1.75rem">This document is published under the <a target="_blank" rel="noreferrer" class="_text-primary-600 _underline _decoration-from-font [text-underline-position:from-font]" href="https://creativecommons.org/licenses/by-nc-sa/4.0">CC BY-NC-SA 4.0 DEED License</a>.</p>',
}

const editorRef = ref(null)
const options = ref({
  locale: locale.value,
  editorKey: 'demo',
  toolbar: {
    enableSourceEditor: true,
  },
  document: {
    title: 'Example Document',
  },
  templates: templates[locale.value],
  cdnUrl: 'https://cdn.umodoc.com',
  onSave(content, page, document) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const success = true
        if (success) {
          useLogger(
            'saveContent',
            t('documentSaved'),
            '{ content, page, document }',
          )
          resolve(true)
        } else {
          reject(t('documentSaveError'))
        }
      }, 2000)
    })
  },
  async onFileUpload(file) {
    if (!file) throw new Error(t('noUploadFile'))
    console.log('onUpload', file)
    await new Promise((resolve) => setTimeout(resolve, 3000))
    return {
      id: new Date().getTime().toString(),
      url: file.url || URL.createObjectURL(file),
      name: file.name,
      type: file.type,
      size: file.size,
    }
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
  '--umo-content-node-selected-background': '#f5f8fc',
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
const useAlert = (content, title = t('notification'), theme = 'info') => {
  const dialog = editorRef.value.useAlert({
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
const useConsole = () => {
  useAlert(t('openConsole'))
}

// 编辑器事件
const onBeforeCreate = () => {
  useLogger('onBeforeCreate', t('onBeforeCreate'))
}
const onCreated = () => {
  useLogger('onCreated', t('onCreated'), '{ editor }')
}
const onChanged = () => {
  const content = editorRef.value.getContent()
  useLogger('onChanged', t('onChanged'), '{ editor }')
}
const onChangedSelection = () => {
  useLogger('onChangedSelection', t('onChanged'), '{ editor }')
}
const onChangedTransaction = () => {
  useLogger('onChangedTransaction', t('onChanged'), '{ editor, transaction }')
}
const onChangedMenu = (currentMenu) => {
  useLogger('onChanged:menu', t('onChangedMenu'), `currentMenu: ${currentMenu}`)
}
const onChangedToolbar = ({ toolbar, oldToolbar }) => {
  useLogger('onChanged:toolbar', t('onChangedToolbar'), { toolbar, oldToolbar })
}
const onChangedPageSize = ({ pageSize, oldPageSize }) => {
  useLogger('onChanged:pageSize', t('onChangedPageSize'), {
    pageSize,
    oldPageSize,
  })
}
const onChangedPageOrientation = ({ pageOrientation, oldPageOrientation }) => {
  useLogger('onChanged:pageOrientation', t('onChangedPageOrientation'), {
    pageOrientation,
    oldPageOrientation,
  })
}
const onChangedPageMargin = ({ pageMargin, oldPageMargin }) => {
  useLogger('onChanged:pageMargin', t('onChangedPageMargin'), {
    pageMargin,
    oldPageMargin,
  })
}
const onChangedPageBackground = ({ pageBackground, oldPageBackground }) => {
  useLogger('onChanged:pageBackground', t('onChangedPageBackground'), {
    pageBackground,
    oldPageBackground,
  })
}
const onChangedZoom = ({ zoomLevel, oldZoomLevel }) => {
  useLogger('onChanged:pageZoom', t('onChangedZoom'), {
    zoomLevel,
    oldZoomLevel,
  })
}
const onChangedPageShowToc = (showToc) => {
  useLogger(
    'onChanged:pageShowToc',
    t('onChangedPageShowToc'),
    `showToc: ${showToc}`,
  )
}
const onChangedpreview = (enabled) => {
  useLogger(
    'onChanged:pagePreview',
    t('onChangedPreview'),
    `enabled: ${enabled}`,
  )
}
const onChangedPageWatermark = ({ pageWatermark, oldPageWatermark }) => {
  useLogger('onChanged:pageWatermark', t('onChangedPageWatermark'), {
    pageWatermark,
    oldPageWatermark,
  })
}
const onChangedLocale = (locale, oldLocale) => {
  console.log('onChanged:locale', t('onChangedLocale'), {
    locale,
    oldLocale,
  })
}
const onPrint = () => {
  useLogger('onPrint', t('onPrint'))
}
const onFocus = () => {
  useLogger('onFocus', t('onFocus'), '{ editor, event }')
}
const onBlur = () => {
  useLogger('onBlur', t('onBlur'), '{ editor, event }')
}
const onSaved = () => {
  useLogger('onSaved', t('onSaved'))
}
const onDestroy = () => {
  useLogger('onDestroy', t('onDestroy'))
}

const setLocale = (lang) => {
  let currentUrl = new URL(window.location)
  let { searchParams } = currentUrl
  searchParams.set('lang', lang === 'zh-CN' ? 'cn' : 'en')
  window.history.replaceState({}, '', currentUrl.toString())
  locale.value = lang
  editorRef.value.setLocale(lang)
}
const changeLang = ({ target }) => {
  setLocale(target.value)
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
  if (url.searchParams.get('lang') == 'cn') {
    locale.value = 'zh-CN'
  } else if (url.searchParams.get('lang') == 'en') {
    locale.value = 'en-US'
  } else if (navigator.language.split('-')[0] === 'zh') {
    locale.value = 'zh-CN'
  } else {
    locale.value = 'en-US'
  }
  localStorage.setItem('umo-editor:demo:locale', locale.value)
  localStorage.setItem('umo-editor:default:locale', locale.value)
  if (editorRef.value.getLocale() !== locale.value) {
    setLocale(locale.value)
  }
  editorRef.value.setContent(content[locale.value])
  editorRef.value.focus()
})
// 初始化设置面板
const initPane = () => {
  const pane = new Pane({
    container: window.document.querySelector('.config-panel'),
  })
  const tab = pane.addTab({
    pages: [
      { title: t('options.title') },
      { title: t('ems.title') },
      { title: t('themes.title') },
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
    title: t('options.toolbar.name'),
  })
  toolbar
    .addBinding(options.value.toolbar, 'defaultMode', {
      label: t('options.toolbar.mode'),
      options: [
        { text: t('options.toolbar.ribbon'), value: 'ribbon' },
        { text: t('options.toolbar.classic'), value: 'classic' },
      ],
    })
    .on('change', ({ value }) => {
      editorRef.value.setToolbar({ mode: value, show: true })
    })
  toolbar.addBinding(options.value.toolbar, 'enableSourceEditor', {
    label: t('options.toolbar.enableSourceEditor'),
  })
  const page = params.addFolder({
    title: t('options.page.name'),
  })

  // 页面设置
  page
    .addBlade({
      view: 'list',
      label: t('options.page.defaultPageSize'),
      options: options.value.dicts.pageSizes.map((item) => ({
        text: l(item.label),
        value: l(item.label),
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
      label: t('options.page.defaultOrientation'),
      options: [
        { text: t('options.page.portrait'), value: 'portrait' },
        { text: t('options.page.landscape'), value: 'landscape' },
      ],
    })
    .on('change', ({ value }) => {
      editorRef.value.setPage({
        orientation: value,
      })
    })
  page
    .addBinding(options.value.page, 'defaultBackground', {
      label: t('options.page.defaultBackground'),
    })
    .on('change', ({ value }) => {
      editorRef.value.setPage({
        background: value,
      })
    })
  page
    .addBinding(options.value.page, 'showBreakMarks', {
      label: t('options.page.showBreakMarks'),
    })
    .on('change', ({ value }) => {
      editorRef.value.setPage({
        showBreakMarks: value,
      })
    })

  // 水印设置
  const watermark = params.addFolder({
    title: t('options.watermark.name'),
  })
  watermark.addBinding(options.value.page.watermark, 'alpha', {
    label: t('options.watermark.alpha'),
    step: 0.1,
    min: 0,
    max: 1,
  })
  watermark.addBinding(options.value.page.watermark, 'fontFamily', {
    label: t('options.watermark.fontFamily'),
    options: options.value.dicts.fonts.map((font) => ({
      text: l(font.label),
      value: font.value,
    })),
  })
  watermark.addBinding(options.value.page.watermark, 'fontSize', {
    label: t('options.watermark.fontSize'),
    step: 1,
    min: 10,
  })
  watermark.addBinding(options.value.page.watermark, 'fontColor', {
    label: t('options.watermark.fontColor'),
  })
  watermark.addBinding(options.value.page.watermark, 'fontWeight', {
    label: t('options.watermark.fontWeight'),
    options: [
      { text: t('options.watermark.normal'), value: 'normal' },
      { text: t('options.watermark.lighter'), value: 'lighter' },
      { text: t('options.watermark.bold'), value: 'bold' },
      { text: t('options.watermark.bolder'), value: 'bolder' },
    ],
  })
  watermark.addBinding(options.value.page.watermark, 'type', {
    label: t('options.watermark.type'),
    options: [
      { text: t('options.watermark.compact'), value: 'compact' },
      { text: t('options.watermark.spacious'), value: 'spacious' },
    ],
  })
  watermark.addBinding(options.value.page.watermark, 'text', {
    label: t('options.watermark.text'),
  })
  watermark.on('change', () => {
    editorRef.value.setWatermark(options.value.page.watermark)
  })

  // 文档设置
  const document = params.addFolder({
    title: t('options.document.name'),
  })
  document.addBinding(options.value.document, 'title', {
    label: t('options.document.title'),
  })
  document
    .addBinding(options.value.document, 'characterLimit', {
      label: t('options.document.characterLimit'),
      step: 1,
    })
    .on('change', resetEditor)
  document.addBinding(options.value.document, 'readOnly', {
    label: t('options.document.readOnly'),
  })
  document.addBinding(options.value.document, 'autofocus', {
    label: t('options.document.autofocus'),
  })
  document.addBinding(options.value.document, 'enableBubbleMenu', {
    label: t('options.document.enableBubbleMenu'),
  })
  document.addBinding(options.value.document, 'enableBlockMenu', {
    label: t('options.document.enableBlockMenu'),
  })
  document
    .addBinding(options.value.document, 'enableMarkdown', {
      label: t('options.document.enableMarkdown'),
    })
    .on('change', resetEditor)
  document.addBinding(options.value.document, 'enableSpellcheck', {
    label: t('options.document.enableSpellcheck'),
  })
  document.addBinding(options.value.document.autoSave, 'enabled', {
    label: t('options.document.autoSave.enabled'),
  })
  document.addBinding(options.value.document.autoSave, 'interval', {
    label: t('options.document.autoSave.interval'),
    step: 1000,
  })

  // 其他配置
  const other = params.addFolder({
    title: t('options.other.name'),
  })
  other
    .addBinding(options.value.file, 'maxSize', {
      label: t('options.other.fileMaxSize'),
      step: 1,
    })
    .on('change', resetEditor)
  other.addBinding(options.value, 'shareUrl', {
    label: t('options.other.shareUrl'),
    format: (v) => v.toString(),
  })
  // tab.on('change', ({ value }) => {
  //   console.log(value, options.value)
  // })

  // 导出配置
  const exportButton = params.addButton({
    title: t('options.export'),
  })
  exportButton.on('click', () => {
    const data = Object.assign({}, options.value)
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
    const data = Object.assign({}, options.value)
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
    useLogger('getOptions', editorRef.value.getOptions())
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
      editorRef.value.setOptions({ shareUrl: 'https://umodoc.com' }),
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
    editorRef.value.setToolbar({
      mode: 'classic',
      show: true,
    })
  })

  // 设置页面信息
  const setPageButton = events.addButton({
    title: t('ems.setPage'),
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
    title: t('ems.setWatermark'),
    label: 'setWatermark',
  })
  setWatermarkButton.on('click', () => {
    editorRef.value.setWatermark({
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
    setLocale(locale.value === 'zh-CN' ? 'en-US' : 'zh-CN')
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
    editorRef.value.setDocument({
      title: title,
    })
    options.value.document.title = title
  })

  // 设置文档内容
  const setContentButton = events.addButton({
    title: t('ems.setContent'),
    label: 'setContent',
  })
  setContentButton.on('click', () => {
    editorRef.value.setContent(t('ems.setContentText'))
  })

  // 获取文档内容
  const getContentButton = events.addButton({
    title: t('ems.getContent'),
    label: 'getContent',
  })
  getContentButton.on('click', () => {
    useConsole()
    useLogger('getContent', editorRef.value.getContent())
  })

  // 获取文档摘要
  const getContentExcerptButton = events.addButton({
    title: t('ems.getContentExcerpt'),
    label: 'getContentExcerpt',
  })
  getContentExcerptButton.on('click', () => {
    const excerpt = editorRef.value.getContentExcerpt()
    useAlert(
      excerpt !== '' ? `${excerpt}` : t('ems.getContentExcerptAlert'),
      t('ems.getContentExcerpt'),
    )
    editorRef.value.getContent()
  })

  // 保存文档内容
  const saveContentButton = events.addButton({
    title: t('ems.saveContent'),
    label: 'saveContent',
  })
  saveContentButton.on('click', () => {
    editorRef.value.saveContent()
  })

  // 获取编辑器实例
  const getEditorButton = events.addButton({
    title: t('ems.getEditor'),
    label: 'getEditor',
  })
  getEditorButton.on('click', () => {
    useConsole()
    useLogger('getEditor', editorRef.value.getEditor())
  })

  // 获取语言
  const getLocaleButton = events.addButton({
    title: t('ems.getLocale'),
    label: 'getLocale',
  })
  getLocaleButton.on('click', () => {
    const locale = editorRef.value.getLocale()
    useAlert(t('ems.getLocaleAlert') + locale)
    useLogger('getLocale', locale)
  })

  // 获取 i18n
  const getI18nButton = events.addButton({
    title: t('ems.getI18n'),
    label: 'getI18n',
  })
  getI18nButton.on('click', () => {
    const i18n = editorRef.value.getI18n()
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
    editorRef.value.setReadOnly()
  })

  // 打印页面
  const printButton = events.addButton({
    title: t('ems.print'),
    label: 'print',
  })
  printButton.on('click', () => {
    editorRef.value.print()
  })

  // 获得焦点
  const focusButton = events.addButton({
    title: t('ems.focus'),
    label: 'focus',
  })
  focusButton.on('click', () => editorRef.value.focus())

  // 失去焦点
  const blurButton = events.addButton({
    title: t('ems.blur'),
    label: 'blur',
  })
  blurButton.on('click', () => editorRef.value.blur())

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
    useLogger('getImage', await editorRef.value.getImage('png'))
  })

  // 获取文本
  const getTextButton = events.addButton({
    title: t('ems.getText'),
    label: 'getText',
  })
  getTextButton.on('click', () => {
    useConsole()
    useLogger('getText', editorRef.value.getText('png'))
  })

  // 获取 HTML
  const getHTMLButton = events.addButton({
    title: t('ems.getHTML'),
    label: 'getHTML',
  })
  getHTMLButton.on('click', () => {
    useConsole()
    useLogger('getHTML', editorRef.value.getHTML())
  })

  // 获取 JSON
  const getJSONButton = events.addButton({
    title: t('ems.getJSON'),
    label: 'getJSON',
  })
  getJSONButton.on('click', () => {
    useConsole()
    useLogger('getJSON', editorRef.value.getJSON())
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
    editorRef.value.useAlert({
      theme: 'success',
      header: 'Info',
      confirmBtn: locale.value === 'zh-CN' ? '确定' : 'Ok',
      body: 'Hello World',
    })
  })

  // 使用编辑器对话框
  const useConfirmButton = events.addButton({
    title: t('ems.useConfirm'),
    label: 'useConfirm',
  })
  useConfirmButton.on('click', () => {
    const confirm = editorRef.value.useConfirm({
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
    editorRef.value.useMessage('info', 'Hello World')
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

  tab.on('change', () => {
    const style = document.querySelector('style[umo-editor-theme]')
    style.innerHTML = getThemeCSS()
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
  min-height: 540px;
  overflow: auto;
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
      gap: 20px;
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
      select {
        border: none;
        outline: none;
        margin-left: -5px;
        font-size: 14px;
        color: #666;
        font-weight: 600;
      }
    }
  }
  .body-container {
    display: flex;
    height: calc(100% - 60px);
  }
  .editor-container {
    position: relative;
    flex: 1;
    min-width: 480px;
  }
  .config-panel {
    width: 380px;
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
