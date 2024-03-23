const { join } = require('path')
const { writeFile } = require('fs/promises')
const { reverseNew, splitByLimit, flatten, cleanFolder } = require('./helpers')

const createJSONBuilder = ({ exportDirectory, links, pageLimit }) => {
  const createAll = data => {
    return writeFile(
      join(exportDirectory, 'all.json'),
      JSON.stringify(data)
    )
  }

  const createTagsList = data => {
    const tagsWithDuplication = flatten(data.map(d => d.tags))
    const tagsWithoutHash = tagsWithDuplication.map(t => t.replace(/^#/, ''))
    const tagNumberTuples = tagsWithoutHash.reduce((result, tag) => {
      const foundTuple = result.find(tuple => tuple[0] === tag)
      if (foundTuple) {
        var updatedTuple = [tag, foundTuple[1] + 1]
        return result
          .filter(tup => tup[0] !== tag)
          .concat([updatedTuple])
      }
      const newTuple = [tag, 1]
      return result.concat([newTuple])
    }, [])
    const sortedTagNumberTuples = tagNumberTuples.sort((a, b) => b[1] - a[1])
    return writeFile(
      join(exportDirectory, 'tags.json'),
      JSON.stringify(sortedTagNumberTuples)
    )
  }

  const createStats = data => {
    return writeFile(
      join(exportDirectory, 'stats.json'),
      JSON.stringify(data)
    )
  }

  const createPages = pages => {
    return pages.map((page, index) => writeFile(
      join(exportDirectory, `page-${index + 1}.json`),
      JSON.stringify(page)
    ))
  }

  const build = async () => {
    await cleanFolder(exportDirectory)

    const pages = splitByLimit(reverseNew(links), pageLimit || 15)

    return Promise.all([
      createAll(links),
      createTagsList(links),
      createStats({
        total: links.length,
        pages: pages.length
      }),
      ...createPages(pages)
    ])
  }

  return {
    createAll,
    createTagsList,
    createStats,
    createPages,
    build
  }
}

module.exports = createJSONBuilder
