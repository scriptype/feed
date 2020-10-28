import headerTemplate from './Header.js'
import contentTemplate from './Content.js'
import footerTemplate from './Footer.js'

export default (state) => `
  <div class="app">
    ${ headerTemplate(state) }
    ${ contentTemplate(state) }
    ${ footerTemplate(state) }
  </div>
`
