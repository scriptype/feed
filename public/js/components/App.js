import linksTemplate from './Links.js'
import paginationTemplate from './Pagination.js'

export default ({ links, stats }) => `
  <div class="app-container">
    ${ linksTemplate({ links }) }
    ${ paginationTemplate({ stats }) }
  </div>
`
