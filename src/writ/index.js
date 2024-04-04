const prepare = require('./prepare')
const minifyPostsJSON = require('./minifyPostsJSON')

const run = async ({ links, rootDirectory, mode, debug }) => {
  const writ = prepare(links)

  await writ[mode]({
    rootDirectory: rootDirectory,
    cli: true,
    debug,
    onFinish({ settings }) {
      return minifyPostsJSON(settings)
    }
  })
}

module.exports = {
  build: (options) => run({
    ...options,
    mode: 'build'
  }),

  start: (options) => run({
    ...options,
    mode: 'start'
  })
}
