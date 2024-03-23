import { requestIdleCallback } from '../lib/utils.js'

export default (state, actions) => {
  requestIdleCallback(() => {
    const listToggle = document.querySelector('.tags-list-toggle')
    const listToggleBtn = listToggle.querySelector('.tags-list-toggle-label')
    const toggleLabels = {
      clickToOpen: 'Show topics',
      clickToClose: 'Hide topics'
    }

    const listToggleAutoExpandHandler = () => {
      if (window.innerWidth <= 900 && listToggle.getAttribute('open') === 'true') {
        listToggle.removeAttribute('open')
      }
      if (window.innerWidth > 900 && !listToggle.hasAttribute('open')) {
        listToggle.setAttribute('open', true)
      }
    }

    listToggleBtn.addEventListener('click', () => {
      if (listToggleBtn.getAttribute('aria-label') === toggleLabels.clickToClose) {
        listToggleBtn.setAttribute('aria-label', toggleLabels.clickToOpen)
      } else {
        listToggleBtn.setAttribute('aria-label', toggleLabels.clickToClose)
      }
    })

    window.addEventListener('resize', listToggleAutoExpandHandler)
    window.addEventListener('orientationchange', listToggleAutoExpandHandler)
    listToggleAutoExpandHandler()

    listToggleBtn.setAttribute('aria-label', toggleLabels.clickToOpen)

    if (!state.tags.length) {
      actions.getTags()
    }
  })

  const topTags = state.tags.slice(0, 100)

  const featuredTags = [
    'web',
    'software',
    'design',
    'accessibility',
    'ux',
    'ai',
    'art',
    'science',
    'environment',
    'nature',
    'philosophy',
    'life',
    'privacy',
    'video'
  ]

  const selectedTags = state.tags.filter(([ tag ]) => featuredTags.includes(tag))

  return `
    <nav class="tags">

    <!-- default open=true to avoid data loss if script fails -->
    <details class="tags-list-toggle" open="true">

      <!-- State agnostic label useful in case script fails to handle updating it with state -->
      <summary class="tags-list-toggle-label" aria-label="Topics"></summary>

      <ol class="tags-list">
        ${selectedTags.map(([tag, linkCount], i) => `
        <li class="tags-list-item" style="--i: ${i}">
          <span class="tag-hash">#</span>
          ${tag}
          <span class="tag-count-badge">${linkCount}</span>
        </li>
        `).join('')}
      </ol>
    </details>
    </nav>
  `
}
