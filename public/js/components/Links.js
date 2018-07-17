export default ({ links }) => `
  <div class="links">
    ${ links.map(link => `
      <div class="link-container">
        <a target="_blank" href="${link.url}">${link.title}</a>
      </div>
    `).join('') }
  </div>
`
