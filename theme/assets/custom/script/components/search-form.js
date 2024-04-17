import Dictionary from '../../../common/dictionary.js'
import { query } from '../helpers.js'

const findContainer = () => query('#search-form-container')
const findForm = () => query('.feat-search')
const findInput = () => query('#feat-search')

const loadResources = () => {
  return new Promise(resolve => {
    const stylesheet = document.createElement('link')
    stylesheet.rel = 'stylesheet'
    stylesheet.href = `${window.assetsPath}/custom/style/search.css`
    stylesheet.onload = resolve
    document.head.appendChild(stylesheet)
  })
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

const renderSearchForm = () => {
  const container = findContainer()
  container.innerHTML = `
    ${searchFormTemplate()}
    ${searchIconTemplate()}
  `
  return container.querySelector('form')
}

const addFormStateClassNames = () => {
  const form = findForm()
  const input = findInput()
  form.classList.toggle('has-query', input.value.trim())
}

const attachEventListeners = ({ searchForm, onSearch, onReset }) => {
  const searchInput = searchForm.querySelector('input[type="search"]')
  addFormStateClassNames()
  searchInput.addEventListener('change', () => {
    addFormStateClassNames()
  })
  searchForm.addEventListener('submit', event => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const query = formData.get('search')
    if (!query.trim()) {
      return onReset()
    }
    onSearch({ query })
  })
}

const render = async ({ onSearch, onReset }) => {
  try {
    await loadResources()
  } catch (e) {
    console.log('failed loading resources for search-form', e)
  }
  return new Promise(resolve => {
    Dictionary.ready(async () => {
      const searchForm = renderSearchForm()
      attachEventListeners({
        searchForm,
        onSearch,
        onReset
      })
      resolve(searchForm)
    })
  })
}

const empty = () => {
  findInput().value = ''
  addFormStateClassNames()
}

const setInputValue = (value) => {
  findInput().value = value
  addFormStateClassNames()
}

export default {
  render,
  empty,
  setInputValue
}
