const twitter = require('./channels/twitter')

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
})
