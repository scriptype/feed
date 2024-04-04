const { readFile, writeFile } = require('fs/promises')
const { join } = require('path')
const writSettings = require('../../settings.json')

const minify = async ({ exportDirectory }) => {
  const postsJSONFile = await readFile(
    join(exportDirectory, 'posts.json'),
    { encoding: 'utf-8' }
  )

  const postsJSON = JSON.parse(postsJSONFile)

  const minifiedPostsJSON = postsJSON.map(post => ({
    title: post.title,
    datePublished: post.datePublished,
    tags: post.tags.map(tag => tag.tag),
    url: post.url
  }))

  const minifiedPostsJSONFileContent = JSON.stringify(minifiedPostsJSON)

  await writeFile(
    join(exportDirectory, 'posts.min.json'),
    minifiedPostsJSONFileContent
  )
}

module.exports = minify
