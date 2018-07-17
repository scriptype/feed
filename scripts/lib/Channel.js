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

  async publish(items, once) {
    if (items.length === 0) {
      return this.logNotStarting()
    }
    if (once) {
      try {
        this.logStart()
        await this.method(items)
        this.logSuccess()
      } catch (e) {
        this.logError('', e)
      }
      return
    }
    for (const [index, item] of items.entries()) {
      this.logStart(item)
      try {
        await this.method(item)
        this.logSuccess(item)
      } catch (e) {
        this.logError(item, e)
      }
      if (index < items.length - 1) {
        await this.wait(this.waitBetween)
      }
    }
  }
}
