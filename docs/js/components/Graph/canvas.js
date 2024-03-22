import Color from "../../lib/Color.js"
const { floor, max } = Math

const DAY = 1000 * 60 * 60 * 24

export default ({ selector, data }) => {
  const width = 1280
  const height = 100
  const pointSize = 5
  const resolution = 1/12
  const outlierScale = 0.8
  const paddingX = 0
  const paddingY = pointSize
  const dataWidth = width - paddingX * 2
  const dataHeight = height - paddingY * 2
  const pointColor = [
    new Color('navy'),
    new Color('#fd5'),
  ]
  const $el = document.querySelector(selector)
  $el.width = width
  $el.height = height
  const ctx = $el.getContext('2d')

  const draw = () => {
    const gradient = pointColor[0].range(pointColor[1], {
      space: "lch",
      outputSpace: "srgb"
    })
    const daysElapsed = (Date.now() - data[0]) / DAY
    const timeResolution = DAY * (daysElapsed / dataWidth / resolution)
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
    ctx.beginPath()
    for (let i = 0; i < heightMap.length - 1; i++) {
      const progress = i / (heightMap.length - 1)
      const x = paddingX + i / resolution
      const y = paddingY + dataHeight - (heightMap[i] / tallestPoint) * dataHeight
      ctx.lineCap = 'round'
      ctx.lineWidth = pointSize
      ctx.lineTo(x, y)
      ctx.strokeStyle = gradient(progress).mix('white', 0.66)
      ctx.stroke()
      ctx.closePath()
      ctx.beginPath()
      ctx.moveTo(x, y)
    }
  }

  return {
    draw
  }
}
