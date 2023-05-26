require('dotenv').config()
const twitter = require('./channels/twitter')
const tumblr = require('./channels/tumblr')

let data = ''

process.stdin.setEncoding('utf8')

process.stdin.on('readable', () => {
  const chunk = process.stdin.read()
  if (chunk !== null) {
    data += chunk
  }
})

process.stdin.on('end', () => {
  const item = JSON.parse(data)[0]
  Promise.all([
    twitter.publish(item),
    tumblr.publish(item)
  ]).catch(e => {
    console.log('error publishing', e)
  })
})
