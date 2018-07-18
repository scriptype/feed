import linksTemplate from './Links.js'
import paginationTemplate from './Pagination.js'

export default (state) => `
  <div class="content-container">
    <main class="content">
      ${ linksTemplate(state) }
      ${ paginationTemplate(state) }
    </main>
  </div>
`
