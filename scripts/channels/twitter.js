const { TwitterApi } = require('twitter-api-v2')
const Channel = require('../lib/Channel')

const userId = '1018316345849630721'

const client = new TwitterApi({
  appKey: process.env.TWITTER_CONSUMER_KEY,
  appSecret: process.env.TWITTER_CONSUMER_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN_KEY,
  accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET
})

const statusTemplate = link => (
  `${link.title}: ${link.url}`
)

const tweet = item => {
  return client.v2.tweet(statusTemplate(item))
}

const retweet = item => {
  return client.v2.retweet(userId, item.tweet.id)
}

const retweetWithQuote = item => {
  return client.v2.tweet(item.tweet.quote, {
    attachment_url: item.tweet.tweetUrl
  })
}

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
