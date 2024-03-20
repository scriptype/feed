const { join } = require('path')
const { writeFile } = require('fs/promises')
const { reverseNew, splitByLimit, cleanFolder } = require('./helpers')

const createJSONBuilder = ({ exportDirectory, links, pageLimit }) => {
  const createAll = data => {
    return writeFile(
      join(exportDirectory, 'all.json'),
      JSON.stringify(data)
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
      createStats({
        total: links.length,
        pages: pages.length
      }),
      ...createPages(pages)
    ])
  }

  return {
    createAll,
    createStats,
    createPages,
    build
  }
}

module.exports = createJSONBuilder
