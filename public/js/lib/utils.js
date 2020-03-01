export const isDev = () =>
  new URLSearchParams(document.location.search).has('dev')

export const truncate = (text, limit, ellipsis) =>
  text.length > limit
    ? `${ text.slice(0, limit).trim() }${ ellipsis ? '...' : '' }`
    : text

export const getLimitedPageNumbers = ({ current, showMax, pages }) => {
  const oneStartCurrent = current - 1
  const result = [pages[oneStartCurrent]]

  function prependNumbers(max) {
    for (let active = oneStartCurrent; active > 0 && oneStartCurrent - active < max; active--) {
      result.unshift(pages[active - 1])
    }
  }

  function appendNumbers(max) {
    for (let active = oneStartCurrent; active < pages.length - 1 && active - oneStartCurrent < max; active++) {
      result.push(pages[active + 1])
    }
  }

  const halfOfShowMax = (showMax - 4) / 2
  if (current < pages.length / 2) {
    const maxNumbersToAppend = halfOfShowMax + (current <= halfOfShowMax ? 1 + halfOfShowMax - current : 0)
    appendNumbers(maxNumbersToAppend)
    prependNumbers(halfOfShowMax)
  } else {
    const lastHalfOfShowMax = (pages.length - 1) - halfOfShowMax
    const maxNumbersToPrepend = halfOfShowMax + (current >= lastHalfOfShowMax ? 1 + current - lastHalfOfShowMax : 0)
    prependNumbers(maxNumbersToPrepend)
    appendNumbers(halfOfShowMax)
  }
  if (result[0] !== pages[1] && result[1] !== pages[1]) {
    result.unshift('...')
  }
  if (result[0] !== pages[0]) {
    result.unshift(pages[0])
  }
  if (result[result.length - 1] !== pages[pages.length - 2] && result[result.length - 2] !== pages[pages.length - 2]) {
    result.push('...')
  }
  if (result[result.length - 1] !== pages[pages.length - 1]) {
    result.push(pages[pages.length - 1])
  }
  return result
}
