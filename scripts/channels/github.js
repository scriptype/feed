const path = require('path')
const Channel = require('../lib/Channel')
const { execute } = require('../helpers')

const commitMessageTemplate = items => `
  ${items.reduce((result, item) => `${result}\n - ${item.url}`, '')}
`

const scriptPath = path.join(__dirname, '..', 'push-to-github.sh')

const push = items =>
  execute({
    cmd: `sh ${scriptPath}`,
    outStream: process.stdout,
    errStream: process.stderr,
    env: Object.assign({}, process.env, {
      LINKS_ADDED: items.length ? commitMessageTemplate(items) : ''
    })
  })

module.exports = new Channel({
  name: 'github',
  method: push
})
