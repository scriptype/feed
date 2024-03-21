/*
 * This is a script that was run just once to add datePublished field
 * to links for the first time.
 *
 * Extract UNIX timestamp of the commit that adds the link.
 *
 * Before running, install the dependency:
 * npm i -S isomorphic-git
 *
 * The file is kept for reference and also why not.
 * */
const fs = require('fs')
const { writeFile } = require('fs/promises')
const git = require('isomorphic-git')

const run = async () => {
  const links = require('./links.json')

  const logs = await git.log({
    fs,
    dir: '.'
  })

  const findMatchingLog = (link) => {
    const urlForRegex = link.url
      .replace(/\?/, '\\?')
      .replace(/\(/, '\\(')
      .replace(/\)/, '\\)')
    const regex = new RegExp(`Add: ${urlForRegex}(?:\n)$`)
    const regex2 = new RegExp(`- ${urlForRegex}`)
    return logs.find(log => (
      log.commit.message.match(regex) ||
      log.commit.message.match(regex2)
    ))
  }

  const findExceptionsLog = (links) => {
    return logs.find(log => (
      log.commit.message.match('alwaysjudgeabookbyitscover')
    ))
  }

  const linksWithDates = links.map(link => {
    const matchingLog = findMatchingLog(link) || findExceptionsLog(link)
    return {
      ...link,
      datePublished: matchingLog.commit.committer.timestamp * 1000
    }
  })

  await writeFile('./links.json', JSON.stringify(linksWithDates, null, 2))
}

run()
