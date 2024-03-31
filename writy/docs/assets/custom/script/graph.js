import Color from "./vendor/Color.js"
import Canvas from './canvas.js'
import OverlayPagination from './overlay-pagination.js'

const init = async (filter = (f => true)) => {
  const posts = await window.posts
  const data = posts.filter(filter).map(p => p.datePublished) 
  const dayScale = 2
  Canvas({
    selector: '#graph',
    height: 200,
    data,
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
    selector: '#overlay-pagination',
    scrollContainer: '.graph-container',
    data,
    dayScale,
    pageSize: 15
  })
}

export default {
  init
}
