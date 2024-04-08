import Dictionary from '../dictionary.js'

const stylesheet = document.createElement('link')
stylesheet.rel = 'stylesheet'
stylesheet.href = `${window.assetsPath}/common/search/search.css`
document.head.appendChild(stylesheet)

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
      “${query}”
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

const searchIconTemplate = () => `
  <svg style="display: none">
      <symbol id="feat-search-icon" viewBox="0 0 512 512">
          <path d="M344.5 298c15-23.6 23.8-51.6 23.8-81.7 0-84.1-68.1-152.3-152.1-152.3C132.1 64 64 132.2 64 216.3c0 84.1 68.1 152.3 152.1 152.3 30.5 0 58.9-9 82.7-24.4l6.9-4.8L414.3 448l33.7-34.3-108.5-108.6 5-7.1zm-43.1-166.8c22.7 22.7 35.2 52.9 35.2 85s-12.5 62.3-35.2 85c-22.7 22.7-52.9 35.2-85 35.2s-62.3-12.5-85-35.2c-22.7-22.7-35.2-52.9-35.2-85s12.5-62.3 35.2-85c22.7-22.7 52.9-35.2 85-35.2s62.3 12.5 85 35.2z"/>
      </symbol>
  </svg>
`

const searchFormTemplate = () => `
  <form class="feat-search" action="">
      <input
          aria-label="Search box"
          type="search"
          id="feat-search"
          class="feat-search-input"
          placeholder=""
          name="search" />
      <button class="feat-search-button">
        <svg class="feat-search-icon" style="width: 18px; height: 18px;">
            <use xlink:href="#feat-search-icon"></use>
        </svg>
        <span class="feat-search-button-text">
          ${Dictionary.lookup('search')}
        </span>
      </button>
  </form>
`

const addFormStateClassNames = (searchForm, searchInput) => {
  if (searchInput.value.trim()) {
    searchForm.classList.add('has-query')
  } else {
    searchForm.classList.remove('has-query')
  }
}

const createSearchForm = () => {
  const container = document.querySelector('#search-form-container')
  container.innerHTML = `
    ${searchFormTemplate()}
    ${searchIconTemplate()}
  `
  return container.querySelector('form')
}

const init = async ({ onReset }) => {
  const searchForm = createSearchForm()
  const resultsContainer = region('main')
  const posts = await window.posts
  const searchIndex = posts.map((post, index) => ({
    content: `
      ${post.title}
      ${post.tags.join(' ')}
      ${post.url}
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
