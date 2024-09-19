const { performInterpolation, purgeRangeCache } = (() => {
  function findRange(input, inputRange) {
    let i
    for (i = 1; i < inputRange.length - 1; ++i) {
      if (inputRange[i] >= input) {
        break
      }
    }
    return i - 1
  }

  const interpolate = ({ value, inputRange, outputRange}) => {
    const range = findRange(value, inputRange)
    const inputMin = inputRange[range]
    const inputMax = inputRange[range + 1]
    const outputMin = outputRange[range]
    const outputMax = outputRange[range + 1]
    let interpolated = value
    interpolated = (interpolated - inputMin) / (inputMax - inputMin)
    interpolated = interpolated * (outputMax - outputMin) + outputMin
    return interpolated
  }

  const performInterpolation = ({ interpolation, id, value }) => {
    const {
      name: interpolationName,
      scope,
      inputRange,
      outputRange,
      cache = true,
      cacheDuration = 300
    } = interpolation
    const [cachedInputRange, cachedOutputRane] = cache ?
      cacheRanges(`${interpolationName}-${id}`, [inputRange, outputRange], cacheDuration) :
      [
        typeof inputRange === 'function' ? inputRange() : inputRange,
        typeof outputRange === 'function' ? outputRange() : outputRange,
      ]
    const interpolated = interpolate({
      value,
      inputRange: cachedInputRange,
      outputRange: cachedOutputRane
    })
    return {
      interpolationName,
      interpolated,
      scope
    }
  }

  let rangeCache = {}
  const cacheRanges = (interpolationName, ranges, cacheDuration) => {
    const cachedRanges = rangeCache[interpolationName]
    if (cachedRanges && (Date.now() - cachedRanges.timestamp < cacheDuration)) {
      return cachedRanges.ranges
    }
    rangeCache[interpolationName] = {
      ranges: ranges.map(r => typeof r === 'function' ? r() : r),
      timestamp: Date.now()
    }
    return rangeCache[interpolationName].ranges
  }

  const purgeRangeCache = () => {
    rangeCache = {}
  }

  return {
    performInterpolation,
    purgeRangeCache
  }
})()

const { getCurrentScript, getScriptParameters } = (() => {
  const toFlagMap = (string) => {
    return string
      .split(',')
      .filter(Boolean)
      .reduce((flags, key) => ({
        ...flags,
        [key]: true
      }), {})
  }

  const getCurrentScript = (scriptName) => {
    const scripts = Array.from(document.getElementsByTagName('script'))
    const currentScript = scripts.find(
      script => script.src.includes(`/${scriptName}`)
    )
    return currentScript
  }

  const getScriptParameters = (currentScript) => {
    const query = currentScript.src.split('?').pop().split('&')
    const parameters = query.reduce((params, part) => {
      const [key, value] = part.split('=')
      return {
        ...params,
        [key]: value
      }
    }, {})

    if (!parameters) {
      return undefined
    }

    if (parameters.report) {
      return {
        ...parameters,
        report: toFlagMap(parameters.report)
      }
    }

    return parameters
  }

  return {
    getCurrentScript,
    getScriptParameters
  }
})()

const validations = (() => {
  const reportVariable = (...args) => {
    if (!args) {
      throw new Error('options are mandatory.')
    }
    if (typeof args[0] === 'string') {
      if (typeof args[1] === 'undefined') {
        throw new Error('2nd argument is necessary when only the variable name is present')
      }
      if (typeof args[1] === 'object' && typeof args[1].value === 'undefined') {
        throw new Error('`value` is mandatory')
      }
    } else if (typeof args[0] === 'object') {
      if (!args[0].name || !args[0].name.trim()) {
        throw new Error('`name` is mandatory')
      }
      if (typeof args[0].value === 'undefined') {
        throw new Error('`value` is mandatory')
      }
    } else {
      throw new Error('First argument must be a string or an object.')
    }
  }

  const reportPageScroll = (...args) => {
    const { direction, interpolations } = args[0]
    if (interpolations) {
      if (!direction) {
        throw new Error('"direction" must be provided for interpolations')
      }
      if (direction !== 'horizontal' && direction !== 'vertical') {
        throw new Error('"direction" can be only "horizontal" or "vertical".')
      }
    }
  }

  const reportScroll = (...args) => {
    if (!args[0]) {
      throw new Error('First argument must be name or options')
    }
    let direction
    if (typeof args[1] === 'string') {
      direction = args[1]
    } else if (typeof args[1] === 'object' && args[1].direction) {
      direction = args[1].direction
    }
    if (direction && direction !== 'horizontal' && direction !== 'vertical') {
      throw new Error('"direction" can be only "horizontal" or "vertical".')
    }
  }

  return {
    reportVariable,
    reportPageScroll,
    reportScroll
  }
})()

const setCSSProperty = (key, value, element = window.document.documentElement) => {
  element.style.setProperty(key, value)
}

const reportResponsiveVariable = (name, valueFn, scope) => {
  window.addEventListener('resize', () => setCSSProperty(name, valueFn(), scope))
  window.addEventListener('orientationchange', () => setCSSProperty(name, valueFn(), scope))
  setCSSProperty(name, valueFn(), scope)
}

const reportPageCursor = (event) => {
  let x, y
  if (event.touches) {
    x = event.touches.item(0).clientX
    y = event.touches.item(0).clientY
  } else {
    x = event.x
    y = event.y
  }
  setCSSProperty('--cursor-x', `${x}px`)
  setCSSProperty('--cursor-y',`${y}px`)

  const { innerWidth, innerHeight } = window

  setCSSProperty('--cursor-x-1', x / innerWidth)
  setCSSProperty('--cursor-y-1', y / innerHeight)
}

const reportPageScroll = ({ direction, interpolations }) => () => {
  validations.reportPageScroll({ direction, interpolations })

  const { scrollTop, scrollLeft } = document.documentElement
  setCSSProperty('--scroll-x', scrollLeft)
  setCSSProperty('--scroll-y', scrollTop)

  const { scrollWidth, scrollHeight } = document.documentElement
  const { innerWidth, innerHeight } = window
  setCSSProperty('--scroll-x-1', scrollLeft / (scrollWidth - innerWidth))
  setCSSProperty('--scroll-y-1', scrollTop / (scrollHeight - innerHeight))

  if (interpolations) {
    interpolations.forEach((interpolation, index) => {
      const { interpolationName, interpolated, scope } = performInterpolation({
        interpolation,
        id: index,
        value: direction === 'horizontal' ? scrollLeft : scrollTop
      })
      setCSSProperty(interpolationName, interpolated, scope)
    })
  }
}

const reportScroll = (...args) => (event) => {
  validations.reportScroll(...args)

  let name
  let direction = 'vertical'
  let interpolations
  if (typeof args[0] === 'string') {
    name = args[0]

    if (typeof args[1] === 'string') {
      direction = args[1]
    } else if (typeof args[1] === 'object') {
      direction = args[1].direction || direction
      interpolations = args[1].interpolations
    }

  } else if (typeof args[0] === 'object') {
    name = args[0].name
    direction = args[0].direction
    interpolations = args[0].interpolations
  }

  const { target } = event
  let absoluteScroll
  let targetScrollSize
  let targetSize
  if (direction === 'horizontal') {
    absoluteScroll = target.scrollLeft
    targetScrollSize = target.scrollWidth
    targetSize = target.clientWidth
  } else if (direction === 'vertical') {
    absoluteScroll = target.scrollTop
    targetScrollSize = target.scrollHeight
    targetSize = target.clientHeight
  }
  setCSSProperty(name, absoluteScroll)
  setCSSProperty(`${name}-1`, absoluteScroll / (targetScrollSize - targetSize))

  if (interpolations) {
    interpolations.forEach((interpolation, index) => {
      const { interpolationName, interpolated, scope } = performInterpolation({
        interpolation,
        id: index,
        value: absoluteScroll
      })
      setCSSProperty(interpolationName, interpolated, scope)
    })
  }
}

const reportVariable = (...args) => {
  validations.reportVariable(...args)
  let name
  let value
  let scope
  if (typeof args[0] === 'string') {
    name = args[0]
    if (typeof args[1] === 'function') {
      return reportResponsiveVariable(name, args[1])
    }
    if (typeof args[1] === 'object') {
      scope = args[1].scope
      value = args[1].value
      if (typeof args[1].value === 'function') {
        return reportResponsiveVariable(name, args[1].value, scope)
      }
    } else {
      value = args[1]
    }
    setCSSProperty(name, value, scope)

  } else if (typeof args[0] === 'object') {
    name = args[0].name
    value = args[0].value
    scope = args[0].scope
    if (typeof value === 'function') {
      return reportResponsiveVariable(name, value, scope)
    }
    setCSSProperty(name, value, scope)
  }
}

const reportIndex = (selector, {
  indexVariableName = '--index',
  rowIndexVariableName = '--row-index',
  rowIndexBy
} = {
  indexVariableName: '--index',
  rowIndexVariableName: '--row-index'
}) => {
  const elements = Array.from(document.querySelectorAll(selector))
  elements.forEach((element, index) => {
    setCSSProperty(indexVariableName, index, element)
    if (typeof rowIndexBy === 'number') {
      const rowIndex = Math.floor(index / rowIndexBy)
      setCSSProperty(rowIndexVariableName, rowIndex, element)
    }
  })
}

const cursor = () => {
  window.addEventListener('mousemove', reportPageCursor)
  window.addEventListener('touchmove', reportPageCursor)
  reportPageCursor({ x: 0, y: 0 })
}

const time = () => {
  const reportSeconds = () => {
    const seconds = (Date.now() - start) / 1000
    reportVariable('--seconds', seconds)
  }

  const reportMilliseconds = () => {
    const milliseconds = (Date.now() - start)
    reportVariable('--milliseconds', milliseconds)
    millisecondsLoop = requestAnimationFrame(reportMilliseconds)
  }

  let start = Date.now()
  let secondsLoop = window.setInterval(reportSeconds, 1000)
  let millisecondsLoop = requestAnimationFrame(reportMilliseconds)

  return {
    clear() {
      window.clearInterval(secondsLoop)
      window.cancelAnimationFrame(millisecondsLoop)
    }
  }
}

const reportGlobals = ({ scroll, cursor } = { scroll: true, cursor: true }) => {
  if (cursor) {
    window.addEventListener('mousemove', reportPageCursor)
    window.addEventListener('touchmove', reportPageCursor)
    reportPageCursor({ x: 0, y: 0 })
  }
  if (scroll) {
    let interpolations = scroll.interpolations
    let direction = scroll.direction
    window.addEventListener('scroll', reportPageScroll({
      direction,
      interpolations
    }))
    window.addEventListener('resize', (e) => {
      purgeRangeCache()
      reportPageScroll({
        direction,
        interpolations
      })(e)
    })
    reportPageScroll({
      direction,
      interpolations
    })()
  }
}

const currentScript = getCurrentScript('kicss.js')
if (currentScript) {
  const queryParameters = getScriptParameters(currentScript)
  if (queryParameters && queryParameters.report) {
    const globalsToReport = queryParameters.report
    reportGlobals(globalsToReport)
  }
  window.kicss = {
    reportScroll,
    reportVariable,
    reportIndex,
    reportGlobals,
    cursor,
    time
  }
}

export {
  reportScroll,
  reportVariable,
  reportIndex,
  reportGlobals,
  cursor,
  time
}

export default {
  reportScroll,
  reportVariable,
  reportIndex,
  reportGlobals,
  cursor,
  time
}
