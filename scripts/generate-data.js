const fs = require('fs')
const mkdirp = require('mkdirp')
const rimraf = require('rimraf')
const _ = require('lodash')
const { last, splitByLimit, createFile } = require('./helpers')

// Get fresh list of links.
const links = require('../links')

// Get all of old links, we'll use this to detect newly added links.
const all = require('../data/all')

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

// Purpose of this file is to keep all links together.
// So, we can take a diff using this file and the new links file in the next turn.
const createAllFile = data =>
  createFile('data/all.json', JSON.stringify(data))

// So that front-end will know how many pages and links are there.
const createStatsFile = data =>
  createFile('data/stats.json', JSON.stringify(data))

// Create individual page documents.
const createPages = pages =>
  pages.map((page, index) =>
    createFile( `data/page-${index + 1}.json`, JSON.stringify(page) )
  )

// Used for splitting links into multiple files.
const pageLimit = 15

// Get pages of links
const pages = splitByLimit(links.reverse(), pageLimit)

const stats = {
  total: links.length,
  pages: pages.length
}

cleanOldDataFolder('data')
  .then(() =>
    Promise.all([
      createAllFile(links),
      createStatsFile(stats),
      ...createPages(pages)
    ])
  )
  .then(() => {
    const newlyAdded = _.differenceBy(links, all, 'url')
    process.stdout.write(JSON.stringify(newlyAdded))
  })
  .catch(err => {
    console.error('error', err)
    process.exit(1)
  })
