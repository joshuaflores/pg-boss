const EventEmitter = require('events')
const pg = require('pg')

class Db extends EventEmitter {
  constructor (config) {
    super()

    if (config.poolSize) {
      config.max = config.poolSize
    }

    config.application_name = config.application_name || 'pgboss'

    this.config = config

    this.open()
  }

  async open () {
    this.pool = new pg.Pool(this.config)
    this.pool.on('error', error => this.emit('error', error))
    this.opened = true
  }

  async close () {
    if (!this.pool.ending) {
      await this.pool.end()
      this.opened = false
    }
  }

  async executeSql (text, values) {
    return this.pool.query(text, values)
  }
}

module.exports = Db
