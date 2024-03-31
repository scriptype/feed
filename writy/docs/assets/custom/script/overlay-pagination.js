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

const init = ({ selector, scrollContainer, data, dayScale, pageSize }) => {
  const list = document.querySelector(selector)
  list.classList.add('js-enhanced')
  list.style.setProperty('--offset-x', calculateOffsetX(data, dayScale) + 'px')

  const oldestDataPoint = last(data)
  const totalDaysElapsed = (Date.now() - oldestDataPoint) / DAY

  const pages = chunk(data, pageSize)
  pages.forEach(setPageLinkProperties(list, dayScale))

  const currentPageLink = list.querySelector('.is-current')
  const container = document.querySelector(scrollContainer)
  container.scrollTo({
    top: 0,
    left: currentPageLink.offsetLeft - (container.clientWidth / 2) + currentPageLink.clientWidth / 2
  })
}

export default {
  init
}
