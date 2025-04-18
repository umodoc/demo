<template>
  <div class="compontents-demo-container umo-scrollbar">
    <div class="demo-sections">
      <section class="demo-section">
        <div class="demo-section-header">
          <h3 class="title">{{ t('demo.overview.title') }}</h3>
        </div>
        <div class="demo-section-body">
          <div class="overview" v-html="t('demo.overview.content')"></div>
        </div>
      </section>
      <section class="demo-section">
        <div class="demo-section-header">
          <h3 class="title">
            {{ t('demo.menuButton.title') }} &lt;umo-menu-button&gt;
          </h3>
          <div class="actions">
            <t-space size="small">
              <t-checkbox v-model="hugeMenuButton">{{
                t('demo.menuButton.showHuge')
              }}</t-checkbox>
            </t-space>
          </div>
        </div>
        <t-collapse
          class="demo-section-body"
          expand-icon-placement="right"
          :expand-on-row-click="false"
          default-expand-all
        >
          <t-collapse-panel :header="t('demo.menuButton.button.title')">
            <umo-menu-button
              :force-huge="hugeMenuButton"
              :ico="demoMenuIcon"
              :text="t('demo.menuButton.button.hideText')"
              hide-text
              @menu-click="onMenuClick"
            />
            <umo-menu-button
              :force-huge="hugeMenuButton"
              :ico="demoMenuIcon"
              :text="t('demo.menuButton.button.showText')"
              @menu-click="onMenuClick"
            />
            <umo-menu-button
              :force-huge="hugeMenuButton"
              :ico="demoMenuIcon"
              :text="t('demo.menuButton.button.textContent')"
              :tooltip="t('demo.menuButton.button.customTooltip')"
              @menu-click="onMenuClick"
            />
            <umo-menu-button
              :force-huge="hugeMenuButton"
              :ico="demoMenuIcon"
              :text="t('demo.menuButton.button.shortcut')"
              shortcut="Ctrl+Shift+X"
              @menu-click="onMenuClick"
            />
            <umo-menu-button
              :force-huge="hugeMenuButton"
              class="menu-button-shortcut"
              :ico="demoMenuIcon"
              :text="t('demo.menuButton.button.shortcutText')"
              shortcut-text="Ctrl+Shift+X"
              @menu-click="onMenuClick"
            />
            <umo-menu-button
              :force-huge="hugeMenuButton"
              :ico="demoMenuIcon"
              :text="t('demo.menuButton.button.menuActive')"
              menu-active
              @menu-click="onMenuClick"
            />
            <umo-menu-button
              :force-huge="hugeMenuButton"
              :ico="demoMenuIcon"
              :text="t('demo.menuButton.button.disabled')"
              disabled
              @menu-click="onMenuClick"
            />
          </t-collapse-panel>
          <t-collapse-panel :header="t('demo.menuButton.dropdown.title')">
            <umo-menu-button
              :force-huge="hugeMenuButton"
              :ico="demoMenuIcon"
              :text="t('demo.menuButton.dropdown.default')"
              menu-type="dropdown"
              :select-options="dropdownOptions"
              @click="onSetDropdownValue"
            >
            </umo-menu-button>
            <umo-menu-button
              :force-huge="hugeMenuButton"
              :ico="demoMenuIcon"
              :text="t('demo.menuButton.dropdown.useSlot')"
              menu-type="dropdown"
            >
              <template #dropmenu>
                <t-dropdown-menu>
                  <t-dropdown-item
                    v-for="(item, index) in dropdownOptions"
                    :key="item.value"
                    :active="item.active"
                    @click="onSetDropdownValue"
                  >
                    {{ index }}. {{ item.content }}
                  </t-dropdown-item>
                </t-dropdown-menu>
              </template>
            </umo-menu-button>
          </t-collapse-panel>
          <t-collapse-panel :header="t('demo.menuButton.select.title')">
            <umo-menu-button
              :text="t('demo.menuButton.select.default')"
              menu-type="select"
              style="width: 120px"
              :select-options="selectOptions"
              :select-value="selectValue"
              filterable
              @menu-click="onSetSelectValue"
            >
            </umo-menu-button>
            <umo-menu-button
              :text="t('demo.menuButton.select.useSlot')"
              menu-type="select"
              style="width: 120px"
              :select-value="selectValue"
              filterable
              @menu-click="onSetSelectValue"
            >
              <t-option
                v-for="(item, index) in selectOptions"
                :value="item.value"
                :key="item.value"
              >
                <span>{{ index + 1 }}. {{ item.label }}</span>
              </t-option>
            </umo-menu-button>
          </t-collapse-panel>
          <t-collapse-panel :header="t('demo.menuButton.popup.title')">
            <umo-menu-button
              :force-huge="hugeMenuButton"
              :ico="demoMenuIcon"
              :text="t('demo.menuButton.popup.default')"
              menu-type="popup"
              :popup-visible="popupVisible"
              @toggle-popup="onTogglePopup"
            >
              <template #content>
                <span>{{ t('demo.menuButton.popup.content') }}</span>
              </template>
            </umo-menu-button>
          </t-collapse-panel>
        </t-collapse>
      </section>
      <section class="demo-section">
        <div class="demo-section-header">
          <h3 class="title">
            {{ t('demo.tooltip.title') }} &lt;umo-tooltip&gt;
          </h3>
        </div>
        <t-collapse
          class="demo-section-body"
          expand-icon-placement="right"
          :expand-on-row-click="false"
          default-expand-all
        >
          <t-collapse-panel :header="t('demo.tooltip.default')">
            <umo-tooltip :content="t('demo.tooltip.content')">
              <t-button size="small" theme="default">
                {{ t('demo.tooltip.buttonText') }}
              </t-button>
            </umo-tooltip>
          </t-collapse-panel>
        </t-collapse>
      </section>
      <section class="demo-section">
        <div class="demo-section-header">
          <h3 class="title">{{ t('demo.dialog.title') }} &lt;umo-dialog&gt;</h3>
        </div>
        <t-collapse
          class="demo-section-body"
          expand-icon-placement="right"
          :expand-on-row-click="false"
          default-expand-all
        >
          <t-collapse-panel :header="t('demo.dialog.default')">
            <t-button size="small" theme="default" @click="openDialog">
              {{ t('demo.dialog.buttonText') }}
            </t-button>
            <umo-dialog
              :visible="dialogVisible"
              :header="t('demo.dialog.header')"
              attach="body"
              width="560px"
              :confirm-btn="t('demo.dialog.confirm')"
              :cancel-btn="t('demo.dialog.cancel')"
              @confirm="onDialogConfirm"
              @close="onDialogClose"
            >
              <div>{{ t('demo.dialog.content') }}</div>
            </umo-dialog>
          </t-collapse-panel>
        </t-collapse>
      </section>
    </div>
  </div>
</template>

<script setup>
import { t, locale } from '@/composables/i18n'
import { UmoMenuButton, UmoTooltip, UmoDialog } from '@umoteam/editor'
import '@umoteam/editor/style'

const hugeMenuButton = ref(false)

const demoMenuIcon = `<svg width="131.488" height="128" viewBox="0 0 131.488 128" xmlns="http://www.w3.org/2000/svg"><g fill-rule="nonzero" fill="none"><path d="M78.005 0L65.638 82.444l-48.62 6.342-.846 5.496 62.256-1.48 11.31-68.28 41.75-10.464-15.855 91.851-32.026 21.985H0L18.074 15.432 78.005 0zM56.971 64.581l-37.523 9.302-.422 2.854 37.522-9.302.423-2.854zm2.431-15.009L21.88 58.874l-.423 2.853 37.522-9.301.423-2.854zm2.431-15.009L24.31 43.865l-.422 2.853 37.522-9.301.423-2.854zm2.431-15.115L26.742 28.75l-.423 2.854 37.522-9.302.423-2.854z" fill="var(--umo-primary-color)" /><path fill-opacity=".7" fill="#FFF" d="M115.633 106.015l-28.855-.106L83.607 128z"/></g></svg>`

const onMenuClick = () => {
  alert('菜单按钮被单击')
}

// dropdown 下拉框
const dropdownOptions = ref([
  { content: t('demo.menuButton.dropdown.options.item1'), value: '1' },
  { content: t('demo.menuButton.dropdown.options.item2'), value: '2' },
  { content: t('demo.menuButton.dropdown.options.item3'), value: '3' },
])
const onSetDropdownValue = ({ value, key }) => {
  if (value || key) {
    dropdownOptions.value.forEach((item) => {
      item.active = item.value === value || item.value === key
    })
  }
}

// select 选择框
const selectOptions = [
  { label: t('demo.menuButton.select.options.item1'), value: '1' },
  { label: t('demo.menuButton.select.options.item2'), value: '2' },
  { label: t('demo.menuButton.select.options.item3'), value: '3' },
]
const selectValue = ref('1')
const onSetSelectValue = (value) => {
  selectValue.value = value
}

// popup 弹出框
const popupVisible = ref(false)
const onTogglePopup = (visible) => {
  popupVisible.value = visible !== undefined ? visible : !popupVisible.value
}

// dialog 对话框
const dialogVisible = ref(false)
const openDialog = () => {
  dialogVisible.value = true
}
const onDialogConfirm = () => {
  dialogVisible.value = false
}
const onDialogClose = () => {
  dialogVisible.value = false
}

// 设置语言
const changeLang = (lang) => {
  if (['zh-CN', 'en-US'].includes(lang)) {
    locale.value = lang
  }
}
// 改变主题
const changeTheme = (theme) => {
  if (['light', 'dark', 'auto'].includes(theme)) {
    document.querySelector('html').setAttribute('theme-mode', theme)
  }
}
const route = useRoute()
watch(
  () => route.query,
  (query) => {
    changeLang(query.lang)
    changeTheme(query.theme)
  },
  { immediate: true, deep: true },
)
</script>

<style lang="less" scoped>
.compontents-demo-container {
  --td-text-color-primary: var(--umo-text-color);
  --td-text-color-disabled: var(--umo-text-color-disabled);
  color: var(--umo-text-color);
  font-family: var(--umo-font-family);
  padding: 25px;
  box-sizing: border-box;
  flex: 1;
  display: flex;
  justify-content: center;
  .demo-sections {
    max-width: 1200px;
    margin-top: 20px;
  }
}
.demo-section {
  margin-bottom: 20px;
  &:last-child {
    padding-bottom: 50px;
  }
  .demo-section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 15px;
    .title {
      font-size: 18px;
      display: flex;
      align-items: center;
      color: var(--umo-primary-color);
      &::before {
        content: ' ';
        display: block;
        width: 4px;
        height: 18px;
        background: var(--umo-primary-color);
        border-radius: 2px;
        margin-right: 10px;
      }
    }
  }
  .demo-section-body {
    --td-component-border: var(--umo-border-color);
    border-radius: 3px;
    .overview {
      font-size: 14px;
      padding: 10px 0 20px;
      :deep(p) {
        margin-bottom: 10px;
        text-align: justify;
      }
      :deep(a) {
        color: var(--umo-primary-color);
        text-decoration: none;
      }
    }
    :deep(.t-collapse-panel) {
      &__header {
        border-bottom: solid 1px var(--umo-border-color);
      }
      &__body {
        background: none;
        border-bottom-left-radius: 3px;
        border-bottom-right-radius: 3px;
      }
      &__content {
        padding: 20px;
      }
    }
  }
}
</style>

<style lang="less">
.menu-button-shortcut {
  kbd {
    color: var(--umo-text-color-light);
    margin-left: 10px;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 10px;
  }
  > .huge {
    kbd {
      display: none;
    }
  }
}
.t-popup {
  --td-radius-medium: var(--umo-radius);
  --td-warning-color: var(--umo-warning-color);
  --td-error-color: var(--umo-error-color);
  &.t-tooltip {
    --td-font-size-body-medium: var(--umo-font-size-small);
    .t-popup__content {
      padding: 5px 12px;
      &:empty {
        display: none;
      }
    }
  }
  .t-dropdown {
    &__menu {
      padding: var(--td-pop-padding-s);
      max-height: var(--umo-popup-max-height) !important;
    }
    &__item {
      font-size: var(--umo-font-size-small);
      padding: 2px var(--td-comp-paddingLR-s);
      min-width: 80px !important;
    }
  }
  &.t-select__dropdown {
    .t-popup__content {
      box-shadow: var(--td-shadow-2), var(--td-shadow-inset-top),
        var(--td-shadow-inset-right), var(--td-shadow-inset-bottom),
        var(--td-shadow-inset-left);
      max-height: var(--umo-popup-max-height);
    }
    .t-select-option {
      &-group__header {
        font-size: var(--umo-font-size-small);
      }
      &.t-size-s {
        height: 26px;
      }
    }
  }
  &__content {
    padding: 0;
  }
}
</style>
