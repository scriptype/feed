import Color from "./vendor/Color.js"
import Canvas from './canvas.js'
import OverlayPagination from './overlay-pagination.js'
const { min, max } = Math

const init = async ({ tag }) => {
  const posts = await window.posts
  const data = posts.filter((link) => !tag || link.tags.includes(tag))
  const minDayScale = 0.8
  const maxDayScale = 2
  const dayScale = min(maxDayScale, max(minDayScale, data.length / 200))
  const canvas = Canvas({
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
      new Color('#ffeaac'),
      new Color('#a6a6e0'),
    ],
  })

  const canvasContainer = document.querySelector('.canvas-container')
  const existingCanvas = canvasContainer.querySelector('canvas')
  if (existingCanvas) {
    existingCanvas.remove()
  }
  const $canvas = canvas.draw()
  canvasContainer.prepend($canvas)

  OverlayPagination.init({
    selectors: {
      list: '#overlay-pagination',
      link: '.overlay-pagination-link',
      scrollContainer: '.graph-container',
      contentContainer: '.links',
      paginationContainer: '.pagination-buttons',
      currentLink: '.overlay-pagination-link.is-current'
    },
    classNames: {
      link: 'overlay-pagination-link',
      currentLink: 'is-current'
    },
    data,
    tag,
    dayScale,
    pageSize: 15
  })
}

export default {
  init
}
