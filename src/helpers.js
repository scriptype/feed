const { rm, mkdir } = require('fs/promises')
const cp = require('child_process')
const axios = require('axios')
const cheerio = require('cheerio')

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

// Remove and re-create a folder.
const cleanFolder = async (folderPath) => {
  await rm(folderPath, { recursive: true })
  await mkdir(folderPath)
  return Promise.resolve()
}

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

const loadPage = async (url) => {
  const { data: html } = await axios.get(url)
  return cheerio.load(html)
}

const scrapePageTitle = async (url) => {
  const $ = await loadPage(url)
  return $('title').text()
}

const isTweet = url => {
  return /twitter.com\/.+\/status\/\d+$/.test(url)
}

const parseTags = (str) => {
  return str
    .split(',')
    .map(tag => tag.trim())
    .filter(tag => tag.length)
}

module.exports = {
  last,
  reverseNew,
  splitByLimit,
  cleanFolder,
  execute,
  loadPage,
  scrapePageTitle,
  isTweet,
  parseTags
}
