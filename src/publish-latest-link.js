const { readFile } = require('fs/promises')
const path = require('path')
const { last } = require('./helpers')
const publish = require('./publish')

module.exports = async () => {
  const linksPath = path.join(__dirname, '..', 'links.json')
  let linksJSON
  try {
    linksJSON = await readFile(linksPath, { encoding: 'utf-8' })
  } catch (e) {
    return console.log('Error reading links.json', e)
  }
  const lastLink = last(JSON.parse(linksJSON))
  return publish(lastLink)
}
