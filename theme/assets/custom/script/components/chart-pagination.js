import Modes from '../modes.js'
import { last, query, queryAll, fixLeadingSlashes } from '../helpers.js'

const findScrollContainer = () => {
  return query('.graph-container')
}

const findContentContainer = () => {
  return query('.links')
}

const findPaginationContainer = (scrollContainer = findScrollContainer()) => {
  return query('#overlay-pagination-container', scrollContainer)
}

const findToggle = (scrollContainer = findScrollContainer()) => {
  return query('#overlay-pagination-toggle', scrollContainer)
}

const findList = (scrollContainer = findScrollContainer()) => {
  return query('#overlay-pagination', scrollContainer)
}

const findListItems = (list = findList()) => {
  return queryAll('.overlay-pagination-item', list)
}

const findLinks = () => {
  return queryAll('.overlay-pagination-link')
}

const findPageLink = (pageNumber, list = findList()) => {
  return query(`[data-page-number="${pageNumber}"]`, list)
}

const findCurrentLink = (list = findList()) => {
  return query('.overlay-pagination-link.is-current', list)
}

const LINK_CLASS = 'overlay-pagination-link'
const CURRENT_LINK_CLASS = 'is-current'
const FAKE_ACTIVE_STATE_CLASS = 'faked-active-state'

const DAY = 1000 * 60 * 60 * 24

const eventListeners = {
  global: null
}

const setContainerProperties = () => {
  const container = findScrollContainer()
  container.classList.toggle('has-scroll', container.scrollWidth > container.clientWidth)
}

const setPageLinkProperties = (dayScale) => (page, i) => {
  const pageStartDate = i === 0 ? Date.now() : page[0]
  const pageEndDate = last(page)
  const daysElapsedInPage = (pageStartDate - pageEndDate) / DAY
  const width = daysElapsedInPage * dayScale
  const list = findList()
  const link = findListItems(list)[i]
  if (link) {
    link.style.setProperty('--i', i)
    link.style.setProperty('--width', width + 'px')
  }
}

const setListProperties = () => {
  const container = findPaginationContainer()
  const toggle = findToggle(container)
  const toggleLabels = {
    clickToOpen: 'Show graph pagination links',
    clickToClose: 'Hide graph pagination links'
  }
  toggle.addEventListener('click', () => {
    if (toggle.textContent === toggleLabels.clickToClose) {
      toggle.textContent = toggleLabels.clickToOpen
    } else {
      toggle.textContent = toggleLabels.clickToClose
    }
  })
  container.setAttribute('open', true)
  toggle.textContent = toggleLabels.clickToClose
}

const setCurrentPageLink = (pageNumber) => {
  const list = findList()
  const currentPageLink = findCurrentLink(list) || findLinks(list)[0]
  currentPageLink.classList.remove(CURRENT_LINK_CLASS)

  if (pageNumber) {
    const pageLink = findPageLink(pageNumber, list)
    pageLink.classList.add(CURRENT_LINK_CLASS)
  } else {
    const pageLink = findLinks(list)[0]
    pageLink.classList.add(CURRENT_LINK_CLASS)
  }
}

const scrollToCurrentPageLink = ({ behavior = 'auto' }) => {
  const link = findCurrentLink()
  if (!link) {
    return
  }
  const container = findScrollContainer()
  const { clientWidth: containerWidth } = container
  const { offsetLeft: linkLeft, clientWidth: linkWidth } = link
  requestAnimationFrame(() => {
    container.scrollTo({
      top: 0,
      left: linkLeft - (containerWidth / 2) + linkWidth / 2,
      behavior
    })
  })
}

const scrollBoost = ({ readonly }) => {
  return new window.ScrollBooster({
    viewport: findScrollContainer(),
    scrollMode: 'native',

    onPointerDown(state, event) {
      let element = event.target
      if (readonly) {
        element = findScrollContainer()
      }
      element.classList.add(FAKE_ACTIVE_STATE_CLASS)
    },

    onPointerUp(state, event) {
      if (readonly) {
        findScrollContainer().classList.remove(FAKE_ACTIVE_STATE_CLASS)
      } else {
        findLinks().forEach(link => {
          link.classList.remove(FAKE_ACTIVE_STATE_CLASS)
        })
      }
    },

    shouldScroll(state, event) {
      return readonly || event.target.classList.contains(LINK_CLASS)
    },

    // Later event handlers will know that drag is in progress
    onClick(state, event) {
      if (state.isMoving) {
        event.isDragScrolling = true
      }
    }
  })
}

const attachClickLinkListener = ({ pages, onClickLink }) => {
  const clickLinkListener = (event) => {
    if (!event.target.classList.contains(LINK_CLASS)) {
      return
    }
    if (event.isDragScrolling) {
      return
    }
    event.preventDefault()

    const pageNumberMatch = event.target.href.match(/\/page\/(\d+)/)
    const pageNumber = pageNumberMatch && Number(pageNumberMatch[1])

    onClickLink({
      pageNumber
    })
  }

  findScrollContainer().addEventListener('click', clickLinkListener)
  return clickLinkListener
}

const attachListenersToAdjustTogglePosition = () => {
  const scrollContainer = findScrollContainer()
  window.addEventListener('resize', setTogglePosition)
  window.addEventListener('orientationchange', setTogglePosition)
  scrollContainer.addEventListener('scroll', setTogglePosition)
  return setTogglePosition
}

const setTogglePosition = () => {
  const scrollContainer = findScrollContainer()
  scrollContainer.style.setProperty(
    '--graph-left', scrollContainer.scrollLeft + 'px'
  )
}

const getBaseUrl = (tag) => {
  const urlParts = [window.permalinkPrefix]
  if (tag) {
    urlParts.push('tags', tag)
  }
  return fixLeadingSlashes(urlParts.filter(Boolean).join('/'))
}

const getPageUrl = (baseUrl, pageNumber) => {
  if (baseUrl === '/') {
    return baseUrl + ['page', String(pageNumber)].join('/')
  }
  return [baseUrl, 'page', String(pageNumber)].join('/')
}

const template = ({ tag, pages, pageNumber }) => {
  const baseUrl = getBaseUrl(tag)
  return `
    <ul id="overlay-pagination" class="overlay-pagination">
      ${pages.map((page, i) => {
        const url = i === 0 ? baseUrl : getPageUrl(baseUrl, i + 1)
        return `
          <li class="overlay-pagination-item">
            <a
              href="${url}"
              data-page-number="${i + 1}"
              class="overlay-pagination-link ${i === pageNumber ? 'is-current' : ''}"
            >
              Page ${i + 1}
            </a>
          </li>
        `
      }).join('')}
    </ul>
  `
}

const rerenderList = ({ tag, pages, pageNumber }) => {
  const list = findList()
  list.outerHTML = template({
    tag,
    pages,
    pageNumber
  })
  return list
}

const render = ({ readonly, mode, tag, pages, pageNumber = 0, dayScale, onPaginate }) => {
  if (!readonly && mode === Modes.full) {
    rerenderList({
      tag,
      pages,
      pageNumber
    })
  }

  setContainerProperties()
  setListProperties()

  pages
    .map(p => p.map(l => l.datePublished))
    .forEach(setPageLinkProperties(dayScale))

  scrollBoost({ readonly })

  if (!readonly) {
    attachClickLinkListener({
      pages,
      onClickLink: onPaginate
    })

    updateCurrentPage({
      pageNumber,
      scrollBehavior: 'auto'
    })
  }

  if (!eventListeners.global) {
    eventListeners.global = attachListenersToAdjustTogglePosition()
  }
  setTogglePosition()
}

const updateCurrentPage = ({ pageNumber, scrollBehavior = 'smooth' }) => {
  setCurrentPageLink(pageNumber)
  scrollToCurrentPageLink({
    behavior: scrollBehavior
  })
}

export default {
  render,
  updateCurrentPage
}
