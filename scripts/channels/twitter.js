const { TwitterApi } = require('twitter-api-v2')
const Channel = require('../lib/Channel')

const client = new TwitterApi({
  appKey: process.env.TWITTER_CONSUMER_KEY,
  appSecret: process.env.TWITTER_CONSUMER_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN_KEY,
  accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET
})

const statusTemplate = link => {
  const title = link.isTweet ? link.retweetQuote : link.title
  return [title, link.url].filter(Boolean).join(': ')
}

const tweet = item => {
  return client.v2.tweet(statusTemplate(item))
}

module.exports = new Channel({
  name: 'twitter',
  method: tweet
})
