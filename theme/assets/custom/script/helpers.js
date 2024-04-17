export const truncate = (text, limit, ellipsis) => {
  return text.length > limit ?
    `${ text.slice(0, limit).trim() }${ ellipsis ? '...' : '' }` :
    text
}

export const region = (id, parent = document) => {
  return parent.querySelector(`[data-region-id="${id}"]`)
}

export const transition = ({ target, className, duration, crossFade }) => {
  target.classList.add(className)
  target.style.setProperty('--transition-duration', duration + 'ms')
  if (crossFade) {
    setTimeout(() => {
      target.classList.remove(className)
    }, duration)
    return new Promise(r => {
      setTimeout(r, duration - duration * crossFade)
    })
  }
  return new Promise(r => {
    setTimeout(() => {
      target.classList.remove(className)
      r()
    }, duration)
  })
}

export const debounce = (fn, timeout) => {
  let waiting
  return (...args) => {
    if (waiting) {
      return
    }
    waiting = true
    setTimeout(() => waiting = false, timeout)
    return fn(...args)
  }
}

export const fetchPrefix = window.permalinkPrefix === '/' ?
  '' :
  window.permalinkPrefix

export const fetchHTML = (path) => {
  const url = [fetchPrefix, path.replace(/^\//, '')].join('/')
  return fetch(url).then(r => r.text())
}

export const HTMLToDOM = (html) => {
  const el = document.createElement('div')
  el.innerHTML = html
  return el.firstElementChild
}

export const last = (arr) => arr[arr.length - 1]

export const chunk = (array, size) => {
  return array.reduce((result, item, index) => {
    if (index % size === 0) {
      return result.concat([[item]])
    }
    return Object.assign([], result, {
      [result.length - 1]: last(result).concat(item)
    })
  }, [])
}

export const query = (selector, parent = document) => {
  return parent.querySelector(selector)
}

export const queryAll = (selector, parent = document) => {
  return parent.querySelectorAll(selector)
}

export const fixLeadingSlashes = (str) => str.replace(/^\/\//, '/')

export const route = (url, state) => {
  window.history.pushState(state, '', `${fetchPrefix}${url}`)
}

export const getTagFromUrl = () => {
  const urlParts = window.location.pathname
    .replace(window.permalinkPrefix, '')
    .split('/')
    .filter(Boolean)
  let tag
  if (urlParts.includes('tags')) {
    tag = urlParts[1]
  }
  return tag
}

export const getPageNumberFromUrl = () => {
  const match = document.location.pathname.match(/page\/(\d+)/)
  return match && Number(match[1])
}

export const getSearchQueryFromUrl = () => {
  const match = document.location.search.match(/\?search=(.+)/)
  return match && decodeURI(match[1])
}

export const scrollToTop = () => {
  document.documentElement.scrollTop = 0
}

export const getPages = ({ links, linksPerPage = 15 }) => {
  return chunk(links, linksPerPage)
}

export const getPageLinks = ({ links, pages, pageNumber, linksPerPage = 15 }) => {
  const _pages = pages || getPages({ links, linksPerPage })

  return pageNumber > 1 ?
    _pages[pageNumber - 1] :
    _pages[0]
}
