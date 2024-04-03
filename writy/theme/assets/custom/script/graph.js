import Color from "./vendor/Color.js"
import Canvas from './canvas.js'
import OverlayPagination from './overlay-pagination.js'
const { min, max } = Math

const init = async (filter = (f => true)) => {
  const posts = await window.posts
  const data = posts.filter(filter)
  const minDayScale = 0.8
  const maxDayScale = 2
  const dayScale = min(maxDayScale, max(minDayScale, data.length / 200))
  Canvas({
    selector: '#graph',
    height: 260,
    data: data.map(p => p.datePublished),
    dayScale,
    lineWidth: 6,
    resolution: 1/12,
    yearMarkPosition: 'bottom',
    yearMarkFont: '30px sans-serif',
    padding: {
      top: 20,
      right: 0,
      bottom: 80,
      left: 0
    },
    colors: [
      new Color('#fd5'),
      new Color('navy'),
    ],
  }).draw()

  OverlayPagination.init({
    selectors: {
      list: '#overlay-pagination',
      link: '.overlay-pagination-link',
      scrollContainer: '.graph-container',
      contentContainer: '.links',
      currentLink: '.overlay-pagination-link.is-current'
    },
    classNames: {
      link: 'overlay-pagination-link',
      currentLink: 'is-current'
    },
    data,
    dayScale,
    pageSize: 15
  })
}

export default {
  init
}
