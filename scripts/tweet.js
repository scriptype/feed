const Twitter = require('twitter')

const client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
})

let tweetItems = ''

process.stdin.setEncoding('utf8')

process.stdin.on('readable', () => {
  const chunk = process.stdin.read()
  if (chunk !== null) {
    tweetItems += chunk
  }
})

process.stdin.on('end', () => {
  console.log('items', JSON.parse(tweetItems))
})

client.get('statuses/user_timeline', {}, function(error, tweets, response) {
  if (!error) {
    console.log(tweets)
  }
  console.log('response', response, tweets)
})
