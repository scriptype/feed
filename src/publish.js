require('dotenv').config()
const twitter = require('./channels/twitter')
const tumblr = require('./channels/tumblr')

module.exports = (entry) => {
  Promise.all([
    twitter.publish(entry),
    tumblr.publish(entry)
  ]).catch(e => {
    console.log('error publishing', e)
  })
}
