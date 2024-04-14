import { fetchPrefix } from './helpers.js'

class Resource {
  constructor({ stylesheets, scripts }) {
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
      link.href = this.stylesheets[id]
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
      script.src = this.scripts[id]
      document.body.appendChild(script)
    }
  }
}

export default {
  homepage: new Resource({
    stylesheets: {
      'homepage-stylesheet': fetchPrefix + '/assets/custom/style/homepage.css'
    }
  }),

  tag: new Resource({
    stylesheets: {
      'tag-stylesheet': fetchPrefix + '/assets/custom/style/tag-page.css'
    }
  }),
}
