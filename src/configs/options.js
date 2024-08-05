import templates from './templates'
import content from './content'

const defaultOptions = {
  editorKey: 'demo',
  toolbar: {
    enableSourceEditor: true,
  },
  document: {
    title: 'Example Document',
  },
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
}

const getOptions = ({ theme, locale }) => {
  return {
    ...defaultOptions,
    locale,
    theme,
    document: {
      content: content[locale],
    },
    assistant: {
      enabled: true,
    },
    templates: templates[locale],
  }
}

export default getOptions
