import Color from "../vendor/Color.js"
import Modes from '../modes.js'
import { query, transition } from '../helpers.js'
import Canvas from './canvas.js'
import ChartPagination from './chart-pagination.js'
const { min, max } = Math

const DAY = 1000 * 60 * 60 * 24

const findScrollContainer = () => query('.graph-container')
const findCanvasContainer = () => query('.canvas-container')
const findCanvas = (container) => query('canvas', container)

const renderCanvas = ({ data, dayScale, startDate }) => {
  const canvas = Canvas({
    height: 260,
    data: data.map(p => p.datePublished),
    dayScale,
    lineWidth: 6,
    resolution: 1/12,
    startDate,
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

  const canvasContainer = findCanvasContainer()
  const existingCanvas = findCanvas(canvasContainer)
  if (existingCanvas) {
    existingCanvas.remove()
  }
  if (data.length) {
    const $canvas = canvas.draw()
    canvasContainer.prepend($canvas)
  }
}

const rerender = () => {
  return `
    <div class="graph-container">
      <div class="canvas-container">
        <details id="overlay-pagination-container">
          <summary id="overlay-pagination-toggle" id="">Pages</summary>
          <ul id="overlay-pagination" class="overlay-pagination"></ul>
        </details>
      </div>
    </div>
  `
}

const render = async ({ readonly, mode, tag, links, pages, pageNumber, startDate = new Date(1532221014000), onPaginate }) => {
  if (mode === Modes.full) {
    findScrollContainer().outerHTML = rerender()
  }

  const totalDaysElapsed = (Date.now() - startDate) / DAY
  const minDayScale = 1665 / totalDaysElapsed
  const maxDayScale = 2
  const dayScale = min(maxDayScale, max(minDayScale, links.length / 200))

  renderCanvas({
    data: links,
    dayScale,
    startDate
  })

  ChartPagination.render({
    readonly,
    mode,
    tag,
    pages,
    pageNumber,
    dayScale,
    onPaginate
  })
}

const updateCurrentPage = ({ pageNumber }) => {
  return ChartPagination.updateCurrentPage({ pageNumber })
}

const remove = async () => {
  const container = findScrollContainer()
  await transition({
    target: container,
    className: 'exiting',
    duration: 300
  })
}

export default {
  render,
  updateCurrentPage,
  remove
}
