const fs = require('fs/promises')
const links = require('../links')

module.exports = async ({ outputPath, link }) => {
  const content = JSON.stringify(links.concat(link), null, 2)
  return fs.writeFile(outputPath, content)
}
