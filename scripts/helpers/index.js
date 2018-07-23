const fs = require('fs')
const cp = require('child_process')
const mkdirp = require('mkdirp')
const rimraf = require('rimraf')

// Get the last item of an array
const last = array => array[array.length - 1]

// Returns a reversed copy array, without mutating it.
const reverseNew = array => Object.assign([], array).reverse()

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

// Create a file with a given path and data.
const createFile = (path, data) => new Promise((resolve, reject) => {
  fs.writeFile(path, data, err => {
    if (err) {
      console.error(`error creating ${path}`, err)
      return reject(err)
    }
    resolve()
  })
})

// Remove and re-create a folder.
const cleanFolder = folderPath => new Promise((resolve, reject) => {
  // Delete of data directory
  rimraf(folderPath, err => {
    if (err) {
      console.error(`error deleting ${folderPath}`, err)
      return reject(err)
    }

    // Ensure data directory exists
    mkdirp(folderPath, err => {
      if (err) {
        console.error(`error creating ${folderPath}`, err)
        return reject(err)
      }
      resolve()
    })
  })
})

// Execute a command and supply output stream, error stream and accept env.
const execute = options => new Promise((resolve, reject) => {
  const { cmd, outStream, errStream, env } = options
  const ps = cp.exec(cmd, { env })
  let errData = ''
  ps.stdout.pipe(outStream)
  ps.stderr.pipe(errStream)
  ps.stderr.on('data', data => {
    errData += data
  })
  ps.on('close', code => {
    if (code === 0) {
      resolve()
    } else {
      reject(new Error(`Error executing ${cmd}. Code: ${code}, Error: ${errData}.`))
    }
  })
})

const stripQuotes = text =>
  text
    .replace(/^"/, '')
    .replace(/"$/, '')

module.exports = {
  last,
  reverseNew,
  splitByLimit,
  createFile,
  cleanFolder,
  execute,
  stripQuotes
}
