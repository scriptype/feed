const Twitter = require('twitter')
const Channel = require('../lib/Channel')
const { stripQuotes } = require('../helpers')

const client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
})

const statusTemplate = link => (
  `"${stripQuotes(link.title)}": ${link.url} ${tagsTemplate(link.tags)}`
)

const tagsTemplate = tags => (
  tags.reduce((result, tag) => `${result} #${tag}`, '')
)

const tweet = item => new Promise((resolve, reject) => {
  const endpoint = 'statuses/update'
  const params = {
    status: statusTemplate(item)
  }
  client.post(endpoint, params, (err, tweet, response) => {
    if (err) {
      return reject(err)
    }
    resolve({ tweet, response })
  })
})

const retweet = item => new Promise((resolve, reject) => {
  const endpoint = `statuses/retweet/${item.tweet.id}`
  client.post(endpoint, (error, tweet, response) => {
    if (error) {
      return reject(error)
    }
    resolve({ tweet, response })
  })
})

const retweetWithQuote = item => new Promise((resolve, reject) => {
  const endpoint = 'statuses/update'
  const params = {
    status: item.tweet.quote,
    attachment_url: item.tweet.tweetUrl
  }
  client.post(endpoint, params, (error, tweet, response) => {
    if (error) {
      return reject(error)
    }
    resolve({ tweet, response })
  })
})

module.exports = new Channel({
  name: 'twitter',
  method(item) {
    if (item.tweet) {
      if (item.tweet.quote) {
        return retweetWithQuote(item)
      }
      return retweet(item)
    }
    return tweet(item)
  }
})
