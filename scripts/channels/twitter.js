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

const tweet = data => new Promise((resolve, reject) => {
  const endpoint = 'statuses/update'
  const params = {
    status: statusTemplate(data)
  }
  client.post(endpoint, params, (err, tweet, response) => {
    if (err) {
      return reject(err)
    }
    resolve({ tweet, response })
  })
})

const retweet = data => new Promise((resolve, reject) => {
  const endpoint = `statuses/retweet/${data.tweet.id}`
  client.post(endpoint, (error, tweet, response) => {
    if (error) {
      return reject(error)
    }
    resolve({ tweet, response })
  })
})

const retweetWithQuote = data => new Promise((resolve, reject) => {
  const endpoint = 'statuses/update'
  const params = {
    status: data.tweet.quote,
    attachment_url: data.tweet.tweetUrl
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
  waitBetween: 1000 * 60,
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
