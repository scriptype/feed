export default ({ links, stats, activePage }) => `
  <div class="pagination">
    <div class="pagination-buttons">
      ${ [...Array(stats.pages + 1).keys()].slice(1).map(page => `
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
