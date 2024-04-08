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

const truncate = (text, limit, ellipsis) => {
  return text.length > limit ?
    `${ text.slice(0, limit).trim() }${ ellipsis ? '...' : '' }` :
    text
}

const wait = (duration) => new Promise(r => setTimeout(r, duration))

const DAY = 1000 * 60 * 60 * 24

const setPageLinkProperties = (list, dayScale) => (page, i) => {
  const pageStartDate = i === 0 ? Date.now() : page[0]
  const pageEndDate = last(page)
  const daysElapsedInPage = (pageStartDate - pageEndDate) / DAY
  const width = daysElapsedInPage * dayScale
  const link = list.querySelector(`li:nth-child(${i + 1})`)
  if (link) {
    link.style.setProperty('--i', i)
    link.style.setProperty('--width', width + 'px')
  }
}

const setListProperties = (list, scrollContainer, data, dayScale) => {
  const container = scrollContainer.querySelector('#overlay-pagination-container')
  const toggle = scrollContainer.querySelector('#overlay-pagination-toggle')
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
  const setTogglePosition = () => {
    console.log('fix me')
    scrollContainer.style.setProperty(
      '--graph-left', scrollContainer.scrollLeft + 'px'
    )
  }
  window.removeEventListener('resize', setTogglePosition)
  window.removeEventListener('orientationchange', setTogglePosition)
  window.addEventListener('resize', setTogglePosition)
  window.addEventListener('orientationchange', setTogglePosition)
  scrollContainer.addEventListener('scroll', setTogglePosition)
  setTogglePosition()
  container.setAttribute('open', true)
  toggle.textContent = toggleLabels.clickToClose
}

const scrollToCurrentPageLink = (list, scrollContainerSelector, currentLinkSelector, behavior = 'auto') => {
  const currentPageLink = list.querySelector(currentLinkSelector)
  if (!currentPageLink) {
    return
  }
  const scrollContainer = document.querySelector(scrollContainerSelector)
  scrollContainer.scrollTo({
    top: 0,
    left: currentPageLink.offsetLeft - (scrollContainer.clientWidth / 2) + currentPageLink.clientWidth / 2,
    behavior
  })
}

const setCurrentPageLink = (list, pageNumber, selectors, classNames) => {
  const currentPageLink = list.querySelector(selectors.currentLink)
  currentPageLink.classList.remove(classNames.currentLink)

  if (pageNumber) {
    const pageLink = list.querySelector(`[data-page-number="${pageNumber}"]`)
    pageLink.classList.add(classNames.currentLink)
  } else {
    const pageLink = list.querySelector(selectors.link + ':first-child')
    pageLink.classList.add(classNames.currentLink)
  }
}

const navigateToPage = (
  tag,
  pages,
  pageNumber,
  contentContainerSelector,
  paginationContainerSelector
) => {
  const contentContainer = document.querySelector(contentContainerSelector)
  contentContainer.querySelectorAll('.link-container').forEach(link => {
    if (link.classList.contains('entering')) {
      link.classList.remove('entering')
    }
    link.classList.add('exiting')
  })

  const links = pageNumber ?
    pages[pageNumber - 1] :
    pages[0]

  wait(250).then(() => {
    /*
     * Put new links in content
     * */
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
      }, 300)
      linkContainer.style.setProperty('--i', i)
      linkElement.href = link.url
      linkTitle.textContent = truncate(link.title, 70, true)
      linkUrl.textContent = truncate(link.url, 50, true)
      linkTags.innerHTML = link.tags.map(t => `<li class="link-tag">#${t}</li>`).join('')
      fragment.appendChild(linkContainer)
    })
    contentContainer.innerHTML = ''
    contentContainer.appendChild(fragment)

    /*
     * Change pagination buttons
     * */
    const fixLeadingSlashes = (str) => str.replace(/^\/\//, '/')
    const urlParts = [window.permalinkPrefix]
    if (tag) {
      urlParts.push('tags', tag)
    }
    const baseUrl = fixLeadingSlashes(urlParts.filter(Boolean).join('/'))
    const paginationContainer = document.querySelector(paginationContainerSelector)
    const paginationContainerTemplate = (previousPage, nextPage) => {
      const adjacentPageUrl = (isPrev) => {
        if (!isPrev) {
          return fixLeadingSlashes(`${baseUrl}/page/${nextPage}`)
        }
        if (previousPage !== 1) {
          return fixLeadingSlashes(`${baseUrl}/page/${previousPage}`)
        }
        return baseUrl
      }

      return `
        <div class="pagination-buttons">
          <a href="${adjacentPageUrl(true)}">« Newer</a>
          ${nextPage ? `<a href="${adjacentPageUrl()}">Older »</a>` : ''}
        </div>
      `
    }

    paginationContainer.innerHTML = paginationContainerTemplate(
      pageNumber ? (pages[pageNumber - 2] && pageNumber - 1) : 2,
      pages[pageNumber] && pageNumber + 1
    )
  })
}

const init = ({ selectors, classNames, data, tag, dayScale, pageSize }) => {
  const list = document.querySelector(selectors.list)
  const scrollContainer = document.querySelector(selectors.scrollContainer)
  setListProperties(
    list,
    scrollContainer,
    data.map(e => e.datePublished),
    dayScale
  )

  const pages = chunk(data, pageSize)
  pages
    .map(p => p.map(l => l.datePublished))
    .forEach(
      setPageLinkProperties(list, dayScale)
    )

  const pageNumber = document.location.pathname.match(/page\/(\d+)/)

  const links = pageNumber ?
    pages[pageNumber[1] - 1] :
    pages[0]

  const state = {
    links,
    pageNumber: pageNumber && Number(pageNumber[1])
  }

  window.history.replaceState(state, '', document.location.href)

  new window.ScrollBooster({
    viewport: scrollContainer,
    scrollMode: 'native',

    onPointerDown(state, event) {
      event.target.classList.add('faked-active-state')
    },

    onPointerUp(state, event) {
      list.querySelectorAll(selectors.link).forEach(link => {
        link.classList.remove('faked-active-state')
      })
    },

    // De-bug using scrollbar to scroll
    shouldScroll(state, event) {
      // e.originalTarget is a Restricted object in case it's the scrollbar
      try {
        return event.originalTarget.classList
      } catch {
        return false
      }
    },

    // Later event handlers will know that drag is in progress
    onClick(state, event) {
      if (state.isMoving) {
        event.isDragScrolling = true
      }
    }
  })

  document.querySelector(selectors.scrollContainer).addEventListener('click', (event) => {
    if (!event.target.classList.contains(classNames.link)) {
      return
    }

    if (event.isDragScrolling) {
      return
    }

    event.preventDefault()

    const pageLink = event.target
    const pageNumber = pageLink.href.match(/\/page\/(\d+)/)

    setCurrentPageLink(
      list,
      pageNumber && pageNumber[1],
      selectors,
      classNames
    )

    navigateToPage(
      tag,
      pages,
      pageNumber && Number(pageNumber[1]),
      selectors.contentContainer,
      selectors.paginationContainer
    )

    requestAnimationFrame(() => {
      scrollToCurrentPageLink(
        list,
        selectors.scrollContainer,
        selectors.currentLink,
        'smooth'
      )
    })

    const links = pageNumber ?
      pages[pageNumber[1] - 1] :
      pages[0]

    const state = {
      links,
      pageNumber: pageNumber && Number(pageNumber[1])
    }

    window.history.pushState(state, '', pageLink.href)
  })

  window.addEventListener("popstate", (event) => {
    if (event.state) {
      setCurrentPageLink(
        list,
        event.state.pageNumber,
        selectors,
        classNames
      )
      navigateToPage(
        tag,
        pages,
        event.state.pageNumber,
        selectors.contentContainer,
        selectors.paginationContainer
      )
      scrollToCurrentPageLink(
        list,
        selectors.scrollContainer,
        selectors.currentLink,
        'smooth'
      )
    } else {
      console.log('no')
    }
  })

  scrollToCurrentPageLink(list, selectors.scrollContainer, selectors.currentLink)
}

export default {
  init
}
