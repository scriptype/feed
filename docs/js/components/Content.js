import linksTemplate from './Links.js'
import graphTemplate from './Graph/index.js'
import paginationTemplate from './Pagination.js'

export default (state) => `
  <main class="content">
    ${ linksTemplate(state) }
    ${ paginationTemplate(state) }
    ${ graphTemplate(state) }
  </main>
`
