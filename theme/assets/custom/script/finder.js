export default class Finder {
  constructor({ entries }) {
    this.entries = entries
    this.index = this.makeIndex()
  }

  makeIndex() {
    return this.entries.map((entry, index) => ({
      content: `
        ${entry.title}
        ${entry.tags.join(' ')}
        ${entry.url}
      `,
      index
    }))
  }

  find(query) {
    const matches = this.index.filter(({ content }) => {
      return content.match(new RegExp(query, 'gsi'))
    })

    return this.entries
      .map((entry, i) => {
        const isMatching = matches.find(({ index }) => index === i)
        return isMatching && entry
      })
      .filter(Boolean)
  }
}
