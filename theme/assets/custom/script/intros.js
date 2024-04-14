const homepage = ({ links }) => ({
  transitionSettings: {
    enter: 800
  },
  html: `
    <div class="homepage-content">
      <h1 class="homepage-title">Welcome to my feed!</h1>

      <p class="homepage-social-links">
          Follow it on <a target="_blank" href="https://twitter.com/reads_feed">Twitter</a>, <a target="_blank" href="https://readsfeed.tumblr.com">Tumblr</a> or via <a target="_blank" href="https://enes.in/feed/feed.xml">RSS</a>.
      </p>

      <p class="homepage-links-count">Total links: ${links.length}</p>
    </div>
  `
})

const tag = ({ tag, links }) => ({
  html: `
    <h1 class="tag-header">
      #${tag}
      <span class="tag-header-post-count">${links.length} links</span>
    </h1>
  `
})

const search = ({ searchQuery, links }) => ({
  html: `
    <h2 class="feat-search-results-message">
      “${searchQuery}”
      <span class="feat-search-results-count">${links.length} links</span>
    </h2>
  `
})

export default {
  homepage,
  tag,
  search
}
