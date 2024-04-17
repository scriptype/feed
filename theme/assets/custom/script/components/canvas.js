const { floor, max } = Math

const DAY = 1000 * 60 * 60 * 24

const createCanvas = () => {
  const canvas = document.createElement('canvas')
  canvas.classList.add('graph')
  canvas.id = 'graph'
  return canvas
}

export default (options) => {
  const {
    data,
    height,
    dayScale,
    resolution,
    colors,
    lineWidth,
    padding,
    startDate,
    yearMarkPosition,
    yearMarkFont
  } = options

  const totalDaysElapsed = (Date.now() - startDate) / DAY
  const width = totalDaysElapsed * dayScale
  const outlierScale = 0.8
  const innerWidth = width - (padding.left + padding.right)
  const innerHeight = height - (padding.top + padding.bottom)

  const getHeightMap = ({ timeResolution }) => {
    const heightMap = []
    let tallestPoint = 0
    for (let i = 0; i < data.length - 1; i ++) {
      const timeElapsed = data[i] - data[data.length - 1]
      let dataPoint = floor(timeElapsed / timeResolution)
      heightMap[dataPoint] = (heightMap[dataPoint] || 0) + 1
      tallestPoint = max(tallestPoint, heightMap[dataPoint])
    }
    const timeElapsedUntilNow = Date.now() - data[data.length - 1]
    const lastDataPoint = floor((timeElapsedUntilNow * 2) / timeResolution)
    heightMap[lastDataPoint] = heightMap[lastDataPoint] || 0
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

  const drawLine = ({ ctx, heightMap, tallestPoint }) => {
    const gradient = colors[0].range(colors[1], {
      space: "lch",
      outputSpace: "srgb"
    })
    ctx.beginPath()
    for (let i = 0; i < heightMap.length - 1; i++) {
      const progress = i / (heightMap.length - 1)
      const x = padding.left + i / resolution
      const y = padding.top + innerHeight - (heightMap[i] / tallestPoint) * innerHeight
      ctx.lineCap = 'round'
      ctx.lineWidth = lineWidth
      ctx.lineTo(x, y)
      ctx.strokeStyle = gradient(progress)
      ctx.stroke()
      ctx.closePath()
      ctx.beginPath()
      ctx.moveTo(x, y)
    }
    ctx.closePath()
  }

  const drawYearMarks = ({ ctx }) => {
    let firstVisibleYear = startDate.getFullYear() + 1
    const firstVisibleYearDate = new Date(0)
    firstVisibleYearDate.setYear(firstVisibleYear)
    const timeToFirstYear = firstVisibleYearDate - startDate
    const startOffset = timeToFirstYear / DAY * dayScale
    const yearLength = floor(365 * dayScale)
    ctx.font = yearMarkFont
    ctx.fillStyle = '#666'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    for (let i = 0; i < innerWidth + startOffset; i++) {
      if (i > startOffset && i % yearLength === 0) {
        const x = padding.left + i - startOffset
        const y = yearMarkPosition === 'bottom' ? height - 40 : 20
        ctx.fillText(firstVisibleYear, x, y)
        firstVisibleYear++
      }
    }
  }

  const draw = () => {
    const $el = createCanvas()
    $el.width = width
    $el.height = height
    const ctx = $el.getContext('2d')
    const timeResolution = DAY * (totalDaysElapsed / innerWidth / resolution)
    const { heightMap, tallestPoint } = getHeightMap({ timeResolution })
    drawLine({
      ctx,
      heightMap,
      tallestPoint
    })
    drawYearMarks({ ctx })
    return $el
  }

  return {
    draw
  }
}
