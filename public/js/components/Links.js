export default ({ links }) => `
  <div class="links">
    ${ links.map(link => `
      <div class="link-container">
        <a class="link" target="_blank" href="${link.url}">
          <span class="link-title">${link.title}</span>
          <span class="link-url">${link.url}</span>
        </a>
      </div>
    `).join('') }
  </div>
`
