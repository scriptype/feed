import LinkTemplate from './Link.js'

export default ({ links }) => `
  <div class="links">
    ${ links.map(LinkTemplate).join('') }
  </div>
`
