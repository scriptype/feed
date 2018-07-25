import { truncate } from '../lib/utils.js'

const TagsTemplate = (tags) => `
  <ul class="link-tags">
    ${tags.map(tag => `
      <li class="link-tag">#${tag}</li>
    `).join('')}
  </ul>
`

export default (link) => `
  <div class="link-container">
    <a class="link" target="_blank" href="${link.url}">
      <span class="link-title">${truncate(link.title, 70, true)}</span>
      <span class="link-url">${truncate(link.url, 50, true)}</span>
      ${link.tags.length ? TagsTemplate(link.tags) : ''}
    </a>
  </div>
`
