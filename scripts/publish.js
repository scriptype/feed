require('dotenv').config()
const twitter = require('./channels/twitter')
const tumblr = require('./channels/tumblr')
const github = require('./channels/github')

let data = ''

process.stdin.setEncoding('utf8')

process.stdin.on('readable', () => {
  const chunk = process.stdin.read()
  if (chunk !== null) {
    data += chunk
  }
})

process.stdin.on('end', () => {
  const items = JSON.parse(data)
  twitter.publish(items)
  tumblr.publish(items)
  github.publish(items, true)
})
