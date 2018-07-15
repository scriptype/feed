const fs = require('fs')
const mkdirp = require('mkdirp')
const rimraf = require('rimraf')

// Get list of links
const links = require('../links')

// Helper: Get the last item of an array
const last = array => array[array.length - 1]

// Helper: Split an array into parts using a limit.
const splitByLimit = (array, limit) =>
  array.reduce((result, item, index) => {
    if (!(index % limit)) {
      return result.concat([[item]])
    }
    return Object.assign([], result, {
      [result.length - 1]: last(result).concat(item)
    })
  }, [])

// Used for splitting links into multiple files,
// each of which will include this many links
const pageLimit = 15

// Get pages of links
const pages = splitByLimit(links, pageLimit)

const cleanOldDataFolder = folderPath => {
  return new Promise((resolve, reject) => {
    // Delete of data directory
    rimraf('data', err => {
      if (err) {
        console.error('error deleting old data folder:', err)
        return reject(err)
      }
      console.log('old data folder deleted.')

      // Ensure data directory exists
      mkdirp('data', err => {
        if (err) {
          console.error('error creating data folder:', err)
          return reject(err)
        }
        console.log('data folder created.')
        resolve()
      })
    })
  })
}

cleanOldDataFolder('data')
  .then(() => {
    // For each page, create a file in data directory
    pages.forEach((page, index) => {
      const fileName = `page-${index + 1}.json`
      const filePath = `data/${fileName}`
      const content = JSON.stringify(page)
      fs.writeFile(filePath, content, err => {
        if (err) console.error(`Error creating ${fileName}.`)
        else console.log(`${fileName} created.`)
      })
    })
  })
  .catch(err => {
    console.error('error', err)
  })
