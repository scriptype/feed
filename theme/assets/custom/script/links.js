import Finder from './finder.js'
import { fetchPrefix } from './helpers.js'

let links = []
let finderInstance

const fetchLinks = (fileName) => {
  links = fetch(`${fetchPrefix}/${fileName}`).then(r => r.json())
  return links
}

const all = async () => {
  return await links
}

const findByTag = async (tag) => {
  return (await links).filter((link) => {
    return !!link.tags.find(t => t.tag === tag)
  })
}

const search = async (query) => {
  finderInstance = finderInstance || new Finder({
    entries: await links,
    searchIn() {
      return [
        this.title,
        this.url,
        this.tags.map(({ tag }) => tag).join(' ')
      ]
    }
  })

  return finderInstance.find(query)
}

export default {
  fetch: fetchLinks,
  all,
  findByTag,
  search
}
