import headerTemplate from './Header.js'
import tagsTemplate from './Tags.js'
import contentTemplate from './Content.js'
import footerTemplate from './Footer.js'

export default (state, actions) => `
  <div class="app">
    ${ headerTemplate(state, actions) }
    ${ tagsTemplate(state, actions) }
    ${ contentTemplate(state, actions) }
    ${ footerTemplate(state, actions) }
  </div>
`
