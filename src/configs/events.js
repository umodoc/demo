// 编辑器事件
const events = {
  onBeforeCreate() {
    useLogger('onBeforeCreate', t('onBeforeCreate'))
  },
  onCreated({ editor }) {
    useLogger('onCreated', t('onCreated'), { editor })
  },
  onChanged({ editor }) {
    useLogger('onChanged', t('onChanged'), { editor })
  },
  onChangedSelection({ editor }) {
    useLogger('onChangedSelection', t('onChangedSelection'), { editor })
  },
  onChangedTransaction({ editor, transaction }) {
    useLogger('onChangedTransaction', t('onChangedTransaction'), {
      editor,
      transaction,
    })
  },
  onChangedMenu(currentMenu) {
    useLogger(
      'onChanged:menu',
      t('onChangedMenu'),
      `currentMenu: ${currentMenu}`,
    )
  },
  onChangedToolbar({ toolbar, oldToolbar }) {
    useLogger('onChanged:toolbar', t('onChangedToolbar'), {
      toolbar,
      oldToolbar,
    })
  },
  onChangedPageSize({ pageSize, oldPageSize }) {
    useLogger('onChanged:pageSize', t('onChangedPageSize'), {
      pageSize,
      oldPageSize,
    })
  },
  onChangedPageOrientation({ pageOrientation, oldPageOrientation }) {
    useLogger('onChanged:pageOrientation', t('onChangedPageOrientation'), {
      pageOrientation,
      oldPageOrientation,
    })
  },
  onChangedPageMargin({ pageMargin, oldPageMargin }) {
    useLogger('onChanged:pageMargin', t('onChangedPageMargin'), {
      pageMargin,
      oldPageMargin,
    })
  },
  onChangedPageBackground({ pageBackground, oldPageBackground }) {
    useLogger('onChanged:pageBackground', t('onChangedPageBackground'), {
      pageBackground,
      oldPageBackground,
    })
  },
  onChangedZoom({ zoomLevel, oldZoomLevel }) {
    useLogger('onChanged:pageZoom', t('onChangedZoom'), {
      zoomLevel,
      oldZoomLevel,
    })
  },
  onChangedPageShowToc(showToc) {
    useLogger(
      'onChanged:pageShowToc',
      t('onChangedPageShowToc'),
      `showToc: ${showToc}`,
    )
  },
  onChangedpreview(enabled) {
    useLogger(
      'onChanged:pagePreview',
      t('onChangedPreview'),
      `enabled: ${enabled}`,
    )
  },
  onChangedPageWatermark({ pageWatermark, oldPageWatermark }) {
    useLogger('onChanged:pageWatermark', t('onChangedPageWatermark'), {
      pageWatermark,
      oldPageWatermark,
    })
  },
  onChangedLocale(locale, oldLocale) {
    useLogger('onChanged:locale', t('onChangedLocale'), {
      locale,
      oldLocale,
    })
  },
  onChangedTheme(theme) {
    useLogger('onChanged:theme', t('onChangedTheme'), theme)
  },
  onContentError(theme) {
    useLogger('onContentError', t('onContentError'), {
      editor,
      error,
      disableCollaboration,
    })
  },
  onPrint() {
    useLogger('onPrint', t('onPrint'))
  },
  onFocus() {
    useLogger('onFocus', t('onFocus'), '{ editor, event }')
  },
  onBlur() {
    useLogger('onBlur', t('onBlur'), '{ editor, event }')
  },
  onSaved() {
    useLogger('onSaved', t('onSaved'))
  },
  onDestroy() {
    useLogger('onDestroy', t('onDestroy'))
  },
}
export default events
