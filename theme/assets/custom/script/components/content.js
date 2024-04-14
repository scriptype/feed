import { query, queryAll, truncate, transition } from '../helpers.js'

const TITLE_CHARS_MAX = 70
const URL_CHARS_MAX = 50
const ENTER_CLASS = 'entering'
const EXIT_CLASS = 'exiting'
const findContainer = () => query('.links')
const findLinkContainers = (container) => queryAll('.link-container', container)
const findLinkElement = (linkContainer) => query('.link', linkContainer)
const findLinkTitle = (linkElement) => query('.link-title', linkElement)
const findLinkUrl = (linkElement) => query('.link-url', linkElement)
const findLinkTags = (linkElement) => query('.link-tags', linkElement)
const linkTagTemplate = (tag) => `<li class="link-tag">#${tag}</li>`
let sampleLinkContainer = null

const exitCurrentLinks = (container) => {
  return Promise.all(
    Array.from(findLinkContainers(container)).map(linkContainer => {
      if (linkContainer.classList.contains(ENTER_CLASS)) {
        linkContainer.classList.remove(ENTER_CLASS)
      }
      return transition({
        target: linkContainer,
        className: EXIT_CLASS,
        duration: 250
      })
    })
  )
}

const enterNewLinks = (container, links) => {
  const fragment = document.createDocumentFragment()
  links.forEach((link, i) => {
    const linkContainer = sampleLinkContainer.cloneNode(true)
    linkContainer.classList.remove(EXIT_CLASS)
    transition({
      target: linkContainer,
      className: ENTER_CLASS,
      duration: 300
    })
    linkContainer.style.setProperty('--i', i)
    const linkElement = findLinkElement(linkContainer)
    const linkTitle = findLinkTitle(linkElement)
    const linkUrl = findLinkUrl(linkElement)
    const linkTags = findLinkTags(linkElement)
    linkElement.href = link.url
    linkTitle.textContent = truncate(link.title, TITLE_CHARS_MAX, true)
    linkUrl.textContent = truncate(link.url, URL_CHARS_MAX, true)
    linkTags.innerHTML = link.tags.map(linkTagTemplate).join('')
    fragment.appendChild(linkContainer)
  })
  container.innerHTML = ''
  container.appendChild(fragment)
}

const render = async ({ links }) => {
  const container = findContainer()
  sampleLinkContainer = (sampleLinkContainer || findLinkContainers(container)[0]).cloneNode(true)
  await exitCurrentLinks(container)
  enterNewLinks(container, links)
}

export default {
  render
}
