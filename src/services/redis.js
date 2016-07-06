import redis from 'redis'
import bluebird from 'bluebird'
import config from '../../config.js'
import invariant from 'invariant'

class RedisClient {
  namespace = undefined
  client = undefined

  initialize = ({
    namespace,
  }) => {
    invariant(namespace, `'namespace' should be provided.`)

    if (this.client) return
    this.namespace = namespace
    // wrap all redis functions with promises
    // it'll append the word Async behind every function name
    // ex:
    //  client.get
    //  client.getAsync
    bluebird.promisifyAll(redis.RedisClient.prototype)
    bluebird.promisifyAll(redis.Multi.prototype)

    this.client = redis.createClient(config.redis.port, config.redis.host)
  }

  getClient = () => {
    invariant(this.client, `call initialize() first.`)
    return this.client
  }

  get = async (key) => {
    const res = await this.getClient().getAsync(`${this.namespace}/${key}`)
    return res
  }

  set = async (key, value) => {
    return this.getClient().setAsync(`${this.namespace}/${key}`, JSON.stringify(value))
  }

  flushDb = async (key) => {
    const redisKey = key ? `${this.namespace}/${key}` : `${this.namespace}`
    return this.getClient().delAsync(redisKey)
  }

  keys = async (key = '*') => {
    return await this.getClient().keysAsync(`${this.namespace}/${key}`)
  }
}

export default new RedisClient()
