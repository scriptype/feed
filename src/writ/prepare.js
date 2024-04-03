const writ = require('writ-cms')

const extendPostAsLink = (post, link) => {
  return {
    ...post,
    publishDatePrototype: {
      value: new Date(link.datePublished),
      checkCache: false
    },
    type: 'link',
    permalink: link.url,
    ...link
  }
}

module.exports = (_links) => {
  const links = _links || require('../../links.json')

  writ.useContentModel((value) => {
    const samplePost = value.posts[0]
    return {
      ...value,
      posts: links.map(link => extendPostAsLink(samplePost, link))
    }
  })

  return writ
}
