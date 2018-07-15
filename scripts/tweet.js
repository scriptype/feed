const Twitter = require('twitter')

const client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
})

const tweetTemplate = data => (
  `I've just read: "${data.title}": ${data.url}`
)

const tweet = data => new Promise((resolve, reject) => {
  const endpoint = 'statuses/update'
  const params = {
    status: tweetTemplate(data)
  }
  client.post(endpoint, params, (err, tweet, response) => {
    if (err) {
      console.error(err)
      process.exit(1)
    }
  })
})

const wait = timeout => new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve()
  }, timeout)
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
  tweetItems = JSON.parse(tweetItems)

  tweetItems.reduce((items, item) =>
    Promise.all(items)
      .then(() => wait(5000))
      .then(() => tweet(item))
  ), [])
})
