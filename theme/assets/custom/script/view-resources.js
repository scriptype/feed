import { fetchPrefix } from './helpers.js'

export default class ViewResources {
  constructor({ pathPrefix = fetchPrefix + '/assets/custom/', stylesheets, scripts }) {
    this.pathPrefix = pathPrefix
    this.stylesheets = stylesheets
    this.scripts = scripts
  }

  load() {
    for (let id in this.stylesheets) {
      if (!this.stylesheets.hasOwnProperty(id)) {
        continue
      }
      if (document.getElementById(id)) {
        continue
      }
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.id = id
      link.href = this.pathPrefix + this.stylesheets[id]
      document.head.appendChild(link)
    }

    for (let id in this.scripts) {
      if (!this.scripts.hasOwnProperty(id)) {
        continue
      }
      if (document.getElementById(id)) {
        continue
      }
      const script = document.createElement('script')
      script.id = id
      script.src = this.pathPrefix + this.scripts[id]
      document.body.appendChild(script)
    }
  }
}
