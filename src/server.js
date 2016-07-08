import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import router from './router.js'
import redis from './services/redis.js'
import mongooseDb from './services/mongoose-db.js'
import invariant from 'invariant'

/**
 * Initialize services here
 */
async function initialize(config) {
  redis.initialize(config.redis)
  await mongooseDb.start({
    url: config.mongoUrl,
  })
}

async function teardown() {
  await mongooseDb.stop()
}

export default class Server {
  _bootstrap = () => {
    // this.app.use((req, res, next) => {
    //   if (req.method === 'OPTIONS') {
    //     res.setHeader('Access-Control-Allow-Origin', '*')
    //     res.status(200)
    //     res.end()
    //   } else {
    //     next()
    //   }
    // })
    this.app.use(cors())
    this.app.use(bodyParser.json())
    this.app.use(bodyParser.urlencoded({ extended: false }))
    this.app.use(cookieParser())
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

  initialize = async (config) => {
    invariant(config, `'config' must be provided`)
    await initialize(config)
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
    await teardown()
    await this.server.close()
  }
}
