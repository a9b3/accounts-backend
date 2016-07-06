import mongoose from 'mongoose'
import invariant from 'invariant'

class MongooseDb {
  _url = undefined
  connected = false

  constructor() {
    mongoose.Promise = Promise
  }

  start = async ({
    url,
  }) => {
    invariant(url, `'url' must be provided`)

    return new Promise((resolve, reject) => {
      if (this.connected) resolve()

      mongoose.connect(url, e => {
        if (e) return reject(e)
        this.connected = true
        resolve()
      })
    })
  }

  stop = () => {
    return new Promise((resolve, reject) => {
      if (!this.connected) resolve()

      mongoose.disconnect(e => {
        if (e) return reject(e)
        this.connected = false
        resolve()
      })
    })
  }

  dangerouslyDropDb = async () => {
    if (!this.connected) return
    return mongoose.connection.db.dropDatabase()
  }
}

export default new MongooseDb()
