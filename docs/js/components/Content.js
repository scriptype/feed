import linksTemplate from './Links.js'
import graphTemplate from './Graph/index.js'
import paginationTemplate from './Pagination.js'

export default (state) => `
  <div class="content-container">
    <main class="content">
      ${ linksTemplate(state) }
      ${ paginationTemplate(state) }
      ${ graphTemplate(state) }
    </main>
  </div>
`
