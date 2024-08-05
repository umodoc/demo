export const l = (data) => {
  const lang = locale.value.replace('-', '_')
  if (typeof data === 'string') {
    return data
  }
  if (typeof data === 'object') {
    return data[lang]
  }
}

export const useLogger = (eventName, ...content) => {
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
