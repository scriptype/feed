import Color from "./vendor/Color.js"
import Canvas from './canvas.js'
import OverlayPagination from './overlay-pagination.js'
const { min, max } = Math

const init = async (filter = (f => true)) => {
  const posts = await window.posts
  const data = posts.filter(filter)
  const minDayScale = 0.61825
  const maxDayScale = 2
  const dayScale = min(maxDayScale, max(minDayScale, data.length / 200))
  console.log({ dayScale })
  Canvas({
    selector: '#graph',
    height: 200,
    data: data.map(p => p.datePublished),
    dayScale,
    lineWidth: 5,
    resolution: 1/12,
    yearMarkPosition: 'bottom',
    padding: {
      top: 0,
      right: 0,
      bottom: 25,
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
