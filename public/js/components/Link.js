const truncateTitle = (title, charLimit) =>
  title.length > charLimit
    ?  `${ title.slice(0, charLimit).trim() }...`
    : title

const TagsTemplate = (tags) => `
  <ul class="link-tags">
    ${ tags.map(tag => `
      <li class="link-tag">#${tag}</li>
    `).join('') }
  </ul>
`

export default (link) => `
  <div class="link-container">
    <a class="link" target="_blank" href="${link.url}">
      <span class="link-title">${truncateTitle(link.title, 40)}</span>
      <span class="link-url">${link.url}</span>
      ${ link.tags.length ? TagsTemplate(link.tags) : '' }
    </a>
  </div>
`
