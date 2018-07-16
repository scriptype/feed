const fs = require('fs')
const path = require('path')
const _ = require('lodash')
const { last, splitByLimit, createFile, cleanFolder } = require('./helpers')

// Get fresh list of links.
const links = require('../links')

const dataFolderPath = path.join(__dirname, '..', 'data')

// Get all of old links, we'll use this to detect newly added links.
const all = require(path.join(dataFolderPath, 'all'))

// Purpose of this file is to keep all links together.
// So, we can take a diff using this file and the new links file in the next turn.
const createAllFile = data =>
  createFile(path.join(dataFolderPath, 'all.json'), JSON.stringify(data))

// So that front-end will know how many pages and links are there.
const createStatsFile = data =>
  createFile(path.join(dataFolderPath, 'stats.json'), JSON.stringify(data))

// Create individual page documents.
const createPages = pages =>
  pages.map((page, index) =>
    createFile( path.join(dataFolderPath, `page-${index + 1}.json`), JSON.stringify(page) )
  )

// Used for splitting links into multiple files.
const pageLimit = 15

// Get pages of links
const pages = splitByLimit(links.reverse(), pageLimit)

const stats = {
  total: links.length,
  pages: pages.length
}

cleanFolder(dataFolderPath)
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
