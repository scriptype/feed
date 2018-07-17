const tumblr = require('tumblr.js')
const Channel = require('../lib/Channel')

const client = tumblr.createClient({
  consumer_key: process.env.TUMBLR_CONSUMER_KEY,
  consumer_secret: process.env.TUMBLR_CONSUMER_SECRET,
  token: process.env.TUMBLR_REQUEST_TOKEN,
  token_secret: process.env.TUMBLR_REQUEST_TOKEN_SECRET
})

client.returnPromises()

const postLink = item =>
  client.createLinkPost('readsfeed', {
    tags: item.tags.join(','),
    title: item.title,
    url: item.url
  })

module.exports = new Channel({
  name: 'tumblr',
  method: postLink,
  waitBetween: 1000 * 60
})
