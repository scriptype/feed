const fs = require('fs')
const mkdirp = require('mkdirp')
const rimraf = require('rimraf')
const _ = require('lodash')

// Get list of links
const links = require('../links')

// Get all of old links
const all = require('../data/all')

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

const cleanOldDataFolder = folderPath => new Promise((resolve, reject) => {
  // Delete of data directory
  rimraf('data', err => {
    if (err) {
      console.error('error deleting old data folder:', err)
      return reject(err)
    }

    // Ensure data directory exists
    mkdirp('data', err => {
      if (err) {
        console.error('error creating data folder:', err)
        return reject(err)
      }
      resolve()
    })
  })
})

const createAllFile = data => new Promise((resolve, reject) => {
  fs.writeFile('data/all.json', JSON.stringify(data), err => {
    if (err) {
      console.error('error creating all.json', err)
      return reject(err)
    }
    resolve()
  })
})

const createPages = pages => pages.map((page, index) =>
  new Promise((resolve, reject) => {
    const fileName = `page-${index + 1}.json`
    const filePath = `data/${fileName}`
    const content = JSON.stringify(page)
    fs.writeFile(filePath, content, err => {
      if (err) {
        console.error(`Error creating ${fileName}.`)
        return reject(err)
      }
      resolve()
    })
  })
)

// Used for splitting links into multiple files,
// each of which will include this many links
const pageLimit = 15

// Get pages of links
const pages = splitByLimit(links.reverse(), pageLimit)

cleanOldDataFolder('data')
  .then(() => createAllFile(links))
  .then(() => Promise.all(createPages(pages)))
  .then(() => {
    const newlyAdded = _.differenceBy(links, all, 'href')
    process.stdout.write(JSON.stringify(newlyAdded))
    process.exit(0)
  })
  .catch(err => {
    console.error('error', err)
    process.exit(1)
  })
