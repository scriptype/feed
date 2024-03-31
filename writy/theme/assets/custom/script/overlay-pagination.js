const last = array => array[array.length - 1]

const chunk = (array, size) =>
  array.reduce((result, item, index) => {
    if (index % size === 0) {
      return result.concat([[item]])
    }
    return Object.assign([], result, {
      [result.length - 1]: last(result).concat(item)
    })
  }, [])

const DAY = 1000 * 60 * 60 * 24

const calculateOffsetX = (data, dayScale) => {
  const daysElapsedSinceMostRecentDataPoint = (Date.now() - data[0]) / DAY
  return daysElapsedSinceMostRecentDataPoint * dayScale / 2
}

const setPageLinkProperties = (list, dayScale) => (page, i) => {
  const daysElapsedInPage = (page[0] - last(page)) / DAY
  const width = daysElapsedInPage * dayScale
  const link = list.querySelector(`li:nth-child(${i + 1})`)
  link.style.setProperty('--i', i)
  link.style.setProperty('--width', width + 'px')
}

const setListProperties = (list, data, dayScale) => {
  list.classList.add('js-enhanced')
  list.style.setProperty('--offset-x', calculateOffsetX(data, dayScale) + 'px')
}

const scrollToCurrentPageLink = (list, scrollContainerSelector, currentLinkSelector, behavior = 'auto') => {
  const currentPageLink = list.querySelector(currentLinkSelector)
  const scrollContainer = document.querySelector(scrollContainerSelector)
  scrollContainer.scrollTo({
    top: 0,
    left: currentPageLink.offsetLeft - (scrollContainer.clientWidth / 2) + currentPageLink.clientWidth / 2,
    behavior
  })
}

const navigateToPage = (pageLink, data, pages, contentContainerSelector) => {
  const pageNumber = pageLink.href.match(/\/page\/(\d+)/)
  const links = pageNumber ?
    pages[pageNumber[1] - 1] :
    pages[0]

  window.history.pushState(links, '', pageLink.href)
  const contentContainer = document.querySelector(contentContainerSelector)
  contentContainer.querySelectorAll('.link-container').forEach(l => l.classList.add('exiting'))
  setTimeout(() => {
    const fragment = document.createDocumentFragment()
    links.forEach((link, i) => {
      const linkContainer = contentContainer.querySelector('.link-container').cloneNode(true)
      const linkElement = linkContainer.querySelector('.link')
      const linkTitle = linkElement.querySelector('.link-title')
      const linkUrl = linkElement.querySelector('.link-url')
      const linkTags = linkElement.querySelector('.link-tags')
      linkContainer.classList.remove('exiting')
      linkContainer.classList.add('entering')
      setTimeout(() => {
        linkContainer.classList.remove('entering')
      }, 800)
      linkContainer.style.setProperty('--i', i)
      linkElement.href = link.url
      linkTitle.textContent = link.title
      linkUrl.textContent = link.url
      linkTags.innerHTML = link.tags.map(t => `<li class="link-tag">#${t}</li>`).join('')
      fragment.appendChild(linkContainer)
    })
    contentContainer.innerHTML = ''
    contentContainer.appendChild(fragment)
  }, 200)
}

const init = ({ selectors, classNames, data, dayScale, pageSize }) => {
  const list = document.querySelector(selectors.list)
  setListProperties(
    list,
    data.map(e => e.datePublished),
    dayScale
  )

  const pages = chunk(data, pageSize)
  pages
    .map(p => p.map(l => l.datePublished))
    .forEach(
      setPageLinkProperties(list, dayScale)
    )

  list.addEventListener('click', (e) => {
    if (!e.target.classList.contains(classNames.link)) {
      return
    }
    e.preventDefault()

    const currentPageLink = list.querySelector(selectors.currentLink)
    currentPageLink.classList.remove(classNames.currentLink)

    const pageLink = e.target
    pageLink.classList.add(classNames.currentLink)

    navigateToPage(e.target, data, pages, selectors.contentContainer)
    scrollToCurrentPageLink(list, selectors.scrollContainer, `.${classNames.currentLink}`, 'smooth')
  })

  scrollToCurrentPageLink(list, selectors.scrollContainer, `.${classNames.currentLink}`)
}

export default {
  init
}
