import Color from "./Color.js"
import Canvas from './canvas.js'

const init = async (filter = (f => true)) => {
  const posts = await window.posts
  const data = posts.filter(filter).map(p => p.datePublished) 
  Canvas({
    selector: '#graph',
    height: 200,
    data,
    dayScale: 2,
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
}

export default {
  init
}
