import Dictionary from '../dictionary.js'

const times = (n, what) => {
  return [...Array(n).keys()].map(() => what)
}

const truncate = (text, limit, ellipsis) => {
  return text.length > limit ?
    `${ text.slice(0, limit).trim() }${ ellipsis ? '...' : '' }` :
    text
}

const region = (regionName) => {
  return document.querySelector(`[data-region-id="${regionName}"]`)
}

const getRandomNoResultsMessage = () => {
  const messages = [
    ...times(5, Dictionary.lookup('search-no-results-1')),
    ...times(4, Dictionary.lookup('search-no-results-2')),
    ...times(3, Dictionary.lookup('search-no-results-3'))
  ]

  return messages[Math.floor(Math.random() * messages.length)]
}

const resultsTemplate = (results, query) => {
  if (!results.length) {
    return `
      <h2 class="feat-search-results-message --no-results">${getRandomNoResultsMessage()}</h2>
    `
  }
  const resultsHTML = results.map(resultItemTemplate).join('')
  return `
    <h2 class="feat-search-results-message">
      "${query}"
      <span class="feat-search-results-count">${results.length} links</span>
    </h2>
    ${resultsHTML}
  `
}

const resultItemTemplate = (link) => {
  return `
    <div class="link-container">
      <a class="link" target="_blank" href="${link.url}">
        <span class="link-title">${truncate(link.title, 70, true)}</span>
        <span class="link-url">${truncate(link.url, 50, true)}</span>
        ${link.tags && `
          <ul class="link-tags">
          ${link.tags.map(tag => `
            <li class="link-tag">#${tag}</li>
          `).join('')}
          </ul>
        `}
      </a>
    </div>
  `
}

const addFormStateClassNames = (searchForm, searchInput) => {
  if (searchInput.value.trim()) {
    searchForm.classList.add('has-query')
  } else {
    searchForm.classList.remove('has-query')
  }
}

const init = async ({ onReset }) => {
  const searchForm = region('search-form')
  const resultsContainer = region('main')
  const posts = await window.posts
  const searchIndex = posts.map((post, index) => ({
    content: `
      ${post.title}
      ${post.tags.join(' ')}
    `,
    index
  }))
  const initialContent = resultsContainer.innerHTML
  const searchInput = searchForm.querySelector('input[type="search"]')
  addFormStateClassNames(searchForm, searchInput)
  searchInput.addEventListener('change', () => {
    addFormStateClassNames(searchForm, searchInput)
  })
  searchForm.addEventListener('submit', event => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const query = formData.get('search')
    if (query.trim() === '') {
      resultsContainer.innerHTML = initialContent
      onReset()
      return
    }
    const matchingPosts = searchIndex.filter(({ content }) => {
      return content.match(new RegExp(query, 'gsi'))
    })
    const results = posts.map((post, i) => {
      const isMatching = matchingPosts.find(({ index }) => index === i)
      if (!isMatching) {
        return null
      }
      return post
    }).filter(Boolean)
    resultsContainer.innerHTML = resultsTemplate(results, query)
  })
}

export default {
  init
}
