import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import router from './router.js'
import redis from './services/redis.js'
import invariant from 'invariant'

/**
 * Initialize services here
 */
async function initialize(opts) {
  redis.initialize(opts)
}

export default class Server {
  _bootstrap = () => {
    this.app.use(cors())
    this.app.use(bodyParser.json())
    this.app.use(bodyParser.urlencoded({ extended: false }))
  }

  _setupRouter = () => {
    this.app.use(router)
  }

  constructor() {
    this.app = express()
    this.server = undefined

    this._bootstrap()
    this._setupRouter()
  }

  initialize = async (opts) => {
    invariant(opts, `'opts' must be provided`)
    await initialize(opts)
  }

  listen(port = 8080) {
    return new Promise((resolve, reject) => {
      this.server = this.app.listen(port, (e) => {
        if (e) return reject(e)
        resolve()
      })
    })
  }

  async stop() {
    if (!this.server) return
    await this.server.close()
  }
}
