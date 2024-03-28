import Canvas from './canvas.js'

const init = async (filter = (f => true)) => {
  const posts = await window.posts
  const data = posts.filter(filter).map(p => p.datePublished) 
  Canvas({
    selector: '#graph',
    data
  }).draw()
}

export default {
  init
}
