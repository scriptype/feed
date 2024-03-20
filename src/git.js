const { execute } = require('./helpers')

const Git = {
  commit({ message, paths }) {
    return execute({
      cmd: `\\
        git pull && \\
        git add ${paths.join(' ')} && \\
        git commit -m "${message}" && \\
        git push\\
      `,
      outStream: process.stdout,
      errStream: process.stderr
    })
  },

  push() {
    return execute({
      cmd: 'git push',
      outStream: process.stdout,
      errStream: process.stderr
    })
  }
}

module.exports = Git
