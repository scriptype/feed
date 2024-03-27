const loadLocaleFile = () => {
  const prefix = window.permalinkPrefix === '/' ? '' : window.permalinkPrefix
  return fetch(`${prefix}/assets/common/dictionary.json`).then(r => r.json())
}

let dictionary = {}
;(async () => dictionary = await loadLocaleFile())()

const lookup = (key, variables = {}) => {
  if (!(key in dictionary)) {
    Debug.debugLog(`unrecognized word: ${key}`)
    return ''
  }
  const translation = dictionary[key]
  let result = translation
  Object.keys(variables).forEach(key => {
    const variable = variables[key]
    result = result.replace('{{' + key + '}}', variable || '')
  })
  return result
}

export default {
  dictionary,
  lookup
}
