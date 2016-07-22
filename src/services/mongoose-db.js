import mongoose from 'mongoose'
import invariant from 'invariant'

class MongooseDb {
  _url = undefined
  connected = false

  constructor() {
    mongoose.Promise = Promise
  }

  /**
   * Starts mongoose connection
   *
   * @param {String} url - eg. localhost:27017
   * @returns {Promise} connection established
   */
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

  /**
   * Closes mongoose connection
   *
   * @returns {Promise} connection closed
   */
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

  /**
   * Drops entire database
   *
   * @returns {Promise} null
   */
  dangerouslyDropDb = async () => {
    if (!this.connected) return
    return mongoose.connection.db.dropDatabase()
  }
}

export default new MongooseDb()
