const fs = require('fs')

// Get the last item of an array
const last = array => array[array.length - 1]

// Split an array into parts using a limit.
const splitByLimit = (array, limit) =>
  array.reduce((result, item, index) => {
    if (!(index % limit)) {
      return result.concat([[item]])
    }
    return Object.assign([], result, {
      [result.length - 1]: last(result).concat(item)
    })
  }, [])

const createFile = (path, data) => new Promise((resolve, reject) => {
  fs.writeFile(path, data, err => {
    if (err) {
      console.error(`error creating ${path}`, err)
      return reject(err)
    }
    resolve()
  })
})

module.exports = {
  last,
  splitByLimit,
  createFile
}
