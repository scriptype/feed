const path = require('path')
const Channel = require('../lib/Channel')
const { execute } = require('../helpers')

const commitMessageTemplate = items => `
  ${items.reduce((result, item) => `${result}\n - ${item.url}`, '')}
`

const push = items => {
  const scriptPath = path.join(__dirname, '..', 'push-to-github.sh')
  return execute({
    cmd: `sh ${scriptPath}`,
    outStream: process.stdout,
    errStream: process.stderr,
    env: {
      LINKS_ADDED: items.length ? commitMessageTemplate(items) : ''
    }
  })
}

module.exports = new Channel({
  name: 'github',
  method: push
})
