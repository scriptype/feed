export default class Finder {
  constructor({ entries, searchIn }) {
    this.entries = entries
    this.itemIndexFn = searchIn
    this.index = this.makeIndex()
  }

  makeIndex() {
    return this.entries.map((entry, index) => ({
      content: this.itemIndexFn.call(entry).join('\n'),
      index
    }))
  }

  find(query) {
    const escapedQuery = query.replace(/\[/g, '\\[')
    const matches = this.index.filter(({ content }) => {
      return content.match(new RegExp(escapedQuery, 'gsi'))
    })

    return this.entries
      .map((entry, i) => {
        const isMatching = matches.find(({ index }) => index === i)
        return isMatching && entry
      })
      .filter(Boolean)
  }
}
