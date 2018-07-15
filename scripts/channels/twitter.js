const Twitter = require('twitter')
const Channel = require('../lib/Channel')

const client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
})

const statusTemplate = data => (
  data.turkish
    ? `Şunu okudum: "${data.title}": ${data.url} ${tagsTemplate(data.tags)}`
    : `I've just read: "${data.title}": ${data.url} ${tagsTemplate(data.tags)}`
)

const tagsTemplate = tags => (
  tags.reduce((result, tag) => `${result} #${tag}`, '')
)

const tweet = data => new Promise((resolve, reject) => {
  const endpoint = 'statuses/update'
  const params = {
    status: statusTemplate(data)
  }
  client.post(endpoint, params, (err, tweet, response) => {
    if (err) {
      console.error(err)
      process.exit(1)
    }
  })
})

module.exports = new Channel({
  name: 'twitter',
  waitBetween: 1000 * 60,
  method: tweet
})
