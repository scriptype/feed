export default (state, actions) => {
  window.requestIdleCallback(() => {
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
    <ol class="tags-list">
      ${selectedTags.map(([tag, linkCount]) => `
      <li class="tags-list-item">${tag} <span class="tag-count-badge">${linkCount}</span></li>
      `).join('')}
    </ol>
    </nav>
  `
}
