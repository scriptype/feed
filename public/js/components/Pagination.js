export default ({ stats }) => `
  <div class="pagination">
    ${ [...Array(stats.pages + 1).keys()].slice(1).map(page => `
      <button
        type="button"
        class="pagination-button"
        onclick="__appEventHandlers.onChangePage(${page})"
      >
        ${page}
      </button>
    `).join('') }
  </div>
`
