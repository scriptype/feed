import { requestIdleCallback } from '../../lib/utils.js'
import Canvas from './canvas.js'

export default ({ links, stats, activePage }) => {
  const fetchAll = async () => {
    const request = await fetch('data/all.json')
    return request.json()
  }

  let fetched = false

  window.addEventListener('scroll', () => {
    if (fetched) {
      return
    }
    const { scrollTop, scrollHeight } = document.documentElement
    const scrollProgress = (scrollTop + window.innerHeight) / scrollHeight
    if (scrollProgress < 0.5) {
      return
    }
    fetched = true

    requestIdleCallback(async () => {
      const all = await fetchAll()
      Canvas({
        selector: '#graph',
        data: all.map(e => e.datePublished)
      }).draw()
    })
  })

  return `
  <div class="graph-container">
    <canvas class="graph" id="graph"></canvas>
  </div>
  `
}
