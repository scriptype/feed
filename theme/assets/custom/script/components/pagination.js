import Modes from '../modes.js'
import { query, fixLeadingSlashes } from '../helpers.js'

const NEWER_PAGE_LINK_ID = 'newer-page-link'
const OLDER_PAGE_LINK_ID = 'older-page-link'

const findContainer = () => query('.pagination-buttons')
const findNewerPageLink = (container) => query(`#${NEWER_PAGE_LINK_ID}`, container)
const findOlderPageLink = (container) => query(`#${OLDER_PAGE_LINK_ID}`, container)

const getBaseUrl = (tag) => {
  const urlParts = [window.permalinkPrefix]
  if (tag) {
    urlParts.push('tags', tag)
  }
  return fixLeadingSlashes(urlParts.filter(Boolean).join('/'))
}

const getPageNumbers = (pageNumber, totalPages) => {
  return {
    newer: pageNumber ? (pageNumber >= 2 && pageNumber - 1) : undefined,
    older: (pageNumber < totalPages) && pageNumber + (pageNumber === 0 ? 2 : 1)
  }
}

const getPageNumberFromLink = (link) => {
  const match = link.href.match(/page\/(\d+)/)
  if (match) {
    return parseInt(match[1], 10)
  }
  return 0
}

const containerTemplate = ({ baseUrl, pageNumbers }) => {
  const newerPageUrl = pageNumbers.newer === 1 ?
    baseUrl :
    fixLeadingSlashes(`${baseUrl}/page/${pageNumbers.newer}`)

  const olderPageUrl = fixLeadingSlashes(`${baseUrl}/page/${pageNumbers.older}`)

  return `
    <div class="pagination-buttons">
      ${pageNumbers.newer ? `<a href="${newerPageUrl}" id="${NEWER_PAGE_LINK_ID}">« Newer</a>` : ''}
      ${pageNumbers.older ? `<a href="${olderPageUrl}" id="${OLDER_PAGE_LINK_ID}">Older »</a>` : ''}
    </div>
  `
}

const renderLinks = ({ tag, pageNumbers }) => {
  const baseUrl = getBaseUrl(tag)

  const container = findContainer()
  container.innerHTML = containerTemplate({
    baseUrl,
    pageNumbers
  })
  return container
}

const attachClickHandlers = ({ container, onClick }) => {
  const links = [
    findNewerPageLink(container),
    findOlderPageLink(container)
  ]

  links.forEach((link, i) => {
    if (!link) {
      return
    }
    link.addEventListener('click', event => {
      event.preventDefault()
      const pageNumber = getPageNumberFromLink(link)
      onClick({
        pageNumber: getPageNumberFromLink(link)
      })
    })
  })
}

const softRender = ({ tag, onPaginate }) => {
  const linksContainer = findContainer()

  attachClickHandlers({
    container: linksContainer,
    onClick: (payload) => onPaginate({
      ...payload,
      tag
    })
  })
}

const fullRender = ({ tag, pageNumber, totalPages, onPaginate }) => {
  const pageNumbers = getPageNumbers(pageNumber || 0, totalPages)

  const linksContainer = renderLinks({
    tag,
    pageNumbers
  })

  attachClickHandlers({
    container: linksContainer,
    onClick: (payload) => onPaginate({
      ...payload,
      tag
    })
  })
}

const render = ({ mode, ...rest }) => {
  if (mode === Modes.hydration) {
    return softRender(rest)
  }
  return fullRender(rest)
}

const remove = () => {
  findContainer().innerHTML = ''
}

export default {
  render,
  remove
}
