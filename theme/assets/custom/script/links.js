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
  return (await links).filter((link) => !tag || link.tags.includes(tag))
}

const search = async (query) => {
  finderInstance = finderInstance || new Finder({
    entries: await links
  })

  return finderInstance.find(query)
}

export default {
  fetch: fetchLinks,
  all,
  findByTag,
  search
}
