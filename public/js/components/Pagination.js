import { getLimitedPageNumbers } from '../lib/utils.js'

const skippedPageNumbers = () => `
  <span class="pagination-skipped-numbers">...</span>
`

export default ({ links, stats, activePage }) => {
  const pages = getLimitedPageNumbers({
    current: activePage,
    showMax: 6,
    pages: [...Array(stats.pages + 1).keys()].slice(1)
  })

  return `
    <div class="pagination">
      <div class="pagination-buttons">
        ${ pages.map(page => page === '...' ? skippedPageNumbers() : `
          <button
            type="button"
            class="pagination-button ${
              activePage === page
                ? 'pagination-button--active'
                : ''
              }"
            id="pagination-button-${page}"
            onclick="__appEventHandlers.onChangePage(${page}, event)"
          >
            ${page}
          </button>
        `).join('') }
      </div>
      <div class="pagination-info">
        ${ stats.total > links.length
          ? `Showing <strong>${links.length}</strong> links.`
          : ''
        }
        Total links: <strong>${stats.total}</strong>.
      </div>
    </div>
  `
}
