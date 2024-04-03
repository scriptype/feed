const writ = require('writ-cms')
const links = require('../links.json')

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

writ.useContentModel((value) => {
  const samplePost = value.posts[0]
  return {
    ...value,
    posts: links.map(link => extendPostAsLink(samplePost, link))
  }
})

writ.build({
  rootDirectory: '.',
  cli: true
})
