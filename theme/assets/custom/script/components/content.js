import Modes from '../modes.js'
import { query, queryAll, truncate, transition } from '../helpers.js'

const TITLE_CHARS_MAX = 70
const URL_CHARS_MAX = 50
const ENTER_CLASS = 'entering'
const EXIT_CLASS = 'exiting'
const findContainer = () => query('.links')
const findLinkElements = () => queryAll('.link')
const findLinkTitle = (linkElement) => query('.link-title', linkElement)
const findLinkUrl = (linkElement) => query('.link-url', linkElement)
const findLinkTags = (linkElement) => query('.link-tags', linkElement)

let sampleLinkContainer = null

const linkTitleInnerHTMLTemplate = (link) => {
  return `<h2>${truncate(link.title, TITLE_CHARS_MAX, true)}</h2>`
}

const linkTitleTemplate = (link) => {
  return `
    <a target="_blank" href="${link.url}" class="link-title" title="${link.title}">
      ${linkTitleInnerHTMLTemplate(link)}
    </a>
  `
}

const linkTagTemplate = ({ tag, permalink }) => {
  return `
    <li class="link-tag-container">
      <a class="link-tag" href="${permalink}">#${tag}</a>
    </li>
  `
}

const exitCurrentLinks = () => {
  return Promise.all(
    Array.from(findLinkElements()).map(linkElement => {
      if (linkElement.classList.contains(ENTER_CLASS)) {
        linkElement.classList.remove(ENTER_CLASS)
      }
      return transition({
        target: linkElement,
        className: EXIT_CLASS,
        duration: 250
      })
    })
  )
}

const enterNewLinks = (links) => {
  const container = findContainer()
  const fragment = document.createDocumentFragment()
  links.forEach((link, i) => {
    const linkElement = sampleLinkContainer.cloneNode(true)
    linkElement.classList.remove(EXIT_CLASS)
    transition({
      target: linkElement,
      className: ENTER_CLASS,
      duration: 300
    })
    linkElement.style.setProperty('--i', i)
    const linkTitle = findLinkTitle(linkElement)
    const linkUrl = findLinkUrl(linkElement)
    const linkTags = findLinkTags(linkElement)
    linkTitle.outerHTML = linkTitleTemplate(link)
    linkUrl.textContent = truncate(link.url, URL_CHARS_MAX, true)
    linkTags.innerHTML = link.tags.map(linkTagTemplate).join('')
    fragment.appendChild(linkElement)
  })
  container.innerHTML = ''
  container.appendChild(fragment)
}

const hydrate = (links) => {
  findLinkElements().forEach((linkElement, i) => {
    const link = links[i]
    const linkTitle = findLinkTitle(linkElement)
    linkTitle.innerHTML = linkTitleTemplate(link)
    linkTitle.title = link.title

    const linkUrl = findLinkUrl(linkElement)
    linkUrl.textContent = truncate(link.url, URL_CHARS_MAX, true)
  })
}

const render = async ({ mode, links }) => {
  if (mode === Modes.hydration) {
    return hydrate(links)
  }
  sampleLinkContainer = (sampleLinkContainer || findLinkElements()[0]).cloneNode(true)
  await exitCurrentLinks()
  enterNewLinks(links)
}

export default {
  render
}
