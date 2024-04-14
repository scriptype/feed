import { query, queryAll } from '../helpers.js'

const TAG_LINK_CLASS = 'tags-list-item-link'
const findOutsideRegions = () => queryAll('header.header, main.content, footer.footer')
const findContainer = () => query('.tags-list-container')
const findToggle = (container = findContainer()) => query('.tags-list-toggle-label', container)
const findList = (container) => query('.tags-list', container)
const findTagLinks = (list) => queryAll('.' + TAG_LINK_CLASS, list)
const isScreenSmall = () => window.innerWidth <= 900

const findClosestTagLink = (element, recursion) => {
  if (element.classList.contains(TAG_LINK_CLASS)) {
    return element
  }
  if (recursion < 1) {
    return undefined
  }
  return findClosestTagLink(element.parentElement, recursion - 1)
}

const toggleLabels = {
  clickToOpen: 'Show topics',
  clickToClose: 'Hide topics'
}

const autoExpand = () => {
  if (isScreenSmall() && findContainer().hasAttribute('open')) {
    collapse()
  }
  if (!isScreenSmall()) {
    expand()
  }
}

const collapse = () => {
  const container = findContainer()
  const outsideRegions = findOutsideRegions()
  const toggleBtn = findToggle(container)
  container.removeAttribute('open')
  toggleBtn.textContent = toggleLabels.clickToOpen
  document.body.classList.remove('tags-list-is-open')
  outsideRegions.forEach(region => {
    region.removeAttribute('inert')
  })
}

const expand = () => {
  const container = findContainer()
  const outsideRegions = findOutsideRegions()
  const toggleBtn = findToggle(container)
  container.setAttribute('open', true)
  toggleBtn.textContent = toggleLabels.clickToClose
  toggleBtn.textContent = toggleLabels.clickToClose
  document.body.classList.add('tags-list-is-open')
  if (isScreenSmall()) {
    outsideRegions.forEach(region => region.inert = true)
  }
}

const attachToggleClickHandler = () => {
  const toggleBtn = findToggle()

  toggleBtn.addEventListener('click', () => {
    // Immediately changing toggle text causes mobile safari not to expand the
    // details element at all.
    setTimeout(() => {
      if (toggleBtn.textContent === toggleLabels.clickToClose) {
        collapse()
      } else {
        expand()
      }
    }, 200)
  })
}

const attachTagClickHandler = (cb) => {
  const container = findContainer()
  const list = findList(container)
  list.addEventListener('click', event => {
    const closestLink = findClosestTagLink(event.target, 2)
    if (closestLink) {
      event.preventDefault()
      cb({
        tag: closestLink.dataset.tag
      })
      if (isScreenSmall()) {
        collapse()
      }
    }
  })
}

const attachResizeHandler = () => {
  window.addEventListener('resize', autoExpand)
  window.addEventListener('orientationchange', autoExpand)
}

const render = ({ onClickTag }) => {
  attachToggleClickHandler()
  attachTagClickHandler(onClickTag)
  attachResizeHandler()
  autoExpand()
}

export default {
  render
}
