import { fetchPrefix } from './helpers.js'

let links = []

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

export default {
  fetch: fetchLinks,
  all,
  findByTag
}
