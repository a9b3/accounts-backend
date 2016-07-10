const env = process.env.NODE_ENV || 'dev'

const config = {}

// env overrides
const port = process.env.PORT
const mongoUrl = process.env.MONGO_URL
const redisHost = process.env.REDIS_HOST
const redisPort = process.env.REDIS_PORT

config.dev = {
  port: port || 8080,
  secret: 'topsecret',
  mongoUrl: mongoUrl || `docker.me:27017/accounts`,
  redis: {
    port: redisPort || 6379,
    host: redisHost || `docker.me`,
    namespace: `LOGIN_DEV`,
  },
}

config.test = {
  port: port || 9123,
  secret: 'topsecret',
  mongoUrl: mongoUrl || `docker.me:27018/accountstest`,
  redis: {
    port: redisPort || 6379,
    host: redisHost || `docker.me`,
    namespace: `LOGIN_TEST`,
  },
}

// require env vars set
config.travis = {
  port: 8080,
  secret: 'topsecret',
  mongoUrl,
  redis: {
    port: redisPort,
    host: redisHost,
    namespace: `LOGIN_TEST`,
  },
}

// require env vars set
config.prod = {
  port: port || 8080,
  secret: 'topsecret',
  mongoUrl: mongoUrl || `${process.env.MONGO_SERVICE_HOST}:${process.env.MONGO_SERVICE_PORT}/accounts`,
  redis: {
    port: process.env.REDIS_SERVICE_PORT,
    host: process.env.REDIS_SERVICE_HOST,
    namespace: `LOGIN_PROD`,
  },
}

export default config[env]
