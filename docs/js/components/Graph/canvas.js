import Color from "../../lib/Color.js"
const { floor, max } = Math

const DAY = 1000 * 60 * 60 * 24

export default ({ selector, data }) => {
  const width = 1280
  const height = 200
  const pointSize = 5
  const resolution = 1/12
  const outlierScale = 0.8
  const paddingX = 0
  const paddingY = pointSize * 11
  const innerWidth = width - paddingX * 2
  const innerHeight = height - paddingY * 2
  const pointColors = [
    new Color('navy'),
    new Color('#fd5'),
  ]
  const $el = document.querySelector(selector)
  $el.width = width
  $el.height = height
  const ctx = $el.getContext('2d')

  const getHeightMap = ({ timeResolution }) => {
    const heightMap = []
    let tallestPoint = 0
    for (let i = 0; i < data.length - 1; i ++) {
      const timeElapsed = data[i] - data[0]
      let dataPoint = floor(timeElapsed / timeResolution)
      heightMap[dataPoint] = (heightMap[dataPoint] || 0) + 1
      tallestPoint = max(tallestPoint, heightMap[dataPoint])
    }
    for (let i = 0; i < heightMap.length; i++) {
      heightMap[i] = heightMap[i] || 0
      if (heightMap[i] === tallestPoint) {
        heightMap[i] *= outlierScale
        tallestPoint *= outlierScale
      }
    }
    return {
      heightMap,
      tallestPoint
    }
  }

  const drawLine = ({ heightMap, tallestPoint }) => {
    const gradient = pointColors[0].range(pointColors[1], {
      space: "lch",
      outputSpace: "srgb"
    })
    ctx.beginPath()
    for (let i = 0; i < heightMap.length - 1; i++) {
      const progress = i / (heightMap.length - 1)
      const x = paddingX + i / resolution
      const y = paddingY + innerHeight - (heightMap[i] / tallestPoint) * innerHeight
      ctx.lineCap = 'round'
      ctx.lineWidth = pointSize
      ctx.lineTo(x, y)
      ctx.strokeStyle = gradient(progress).mix('white', 0.66)
      ctx.stroke()
      ctx.closePath()
      ctx.beginPath()
      ctx.moveTo(x, y)
    }
    ctx.closePath()
  }

  const drawYearMarks = () => {
    const daysElapsed = (Date.now() - data[0]) / DAY
    const dayScale = innerWidth / daysElapsed
    const startDate = new Date(data[0])
    let firstVisibleYear = startDate.getFullYear() + 1
    const firstVisibleYearDate = new Date(0)
    firstVisibleYearDate.setYear(firstVisibleYear)
    const timeToFirstYear = firstVisibleYearDate - data[0]
    const startOffset = timeToFirstYear / DAY * dayScale
    ctx.font = '22px sans-serif'
    ctx.fillStyle = '#666'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    for (let i = 0; i < innerWidth + startOffset; i++) {
      if (i > startOffset && i % floor(365 * dayScale) === 0) {
        const x = paddingX + i - startOffset
        const y = height - 10
        ctx.fillText(firstVisibleYear, x, y)
        firstVisibleYear++
      }
    }
  }

  const draw = () => {
    const daysElapsed = (Date.now() - data[0]) / DAY
    const timeResolution = DAY * (daysElapsed / innerWidth / resolution)
    const { heightMap, tallestPoint } = getHeightMap({ timeResolution })
    drawLine({
      heightMap,
      tallestPoint
    })
    drawYearMarks()
  }

  return {
    draw
  }
}
