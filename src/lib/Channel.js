module.exports = class Channel {
  constructor({ name, method, waitBetween = 1000 }) {
    this.name = name
    this.method = method
    this.waitBetween = waitBetween
    return this
  }

  log(message, ...args) {
    console.log(`log ${this.name}: ${message}`, ...args)
  }

  error(message, ...args) {
    console.error(`error ${this.name}: ${message}`, ...args)
  }

  logNotStarting(...args) {
    this.log(...['nothing to publish', ...args])
  }

  logStart(...args) {
    this.log(...['publishing', ...args])
  }

  logSuccess(...args) {
    this.log(...['published', ...args])
  }

  logError(...args) {
    this.error(...['couldnt publish', ...args])
  }

  wait(timeout) {
    return new Promise(resolve => {
      setTimeout(() => resolve(), timeout)
    })
  }

  async publish(item) {
    if (!item) {
      return this.logNotStarting()
    }
    try {
      this.logStart()
      await this.method(item)
      this.logSuccess()
    } catch (e) {
      this.logError(e)
    }
  }
}
