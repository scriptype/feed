export default class Finder {
  constructor({ entries, searchIn }) {
    this.entries = entries
    this.indexFields = searchIn
    this.index = this.makeIndex()
  }

  makeIndex() {
    return this.entries.map((entry, index) => {
      const content = this.indexFields.map(field => {
        const fieldValue = entry[field]
        if (Array.isArray(entry[field])) {
          return fieldValue.join(' ')
        }
        return fieldValue
      }).join('\n')
      return {
        content,
        index
      }
    })
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
