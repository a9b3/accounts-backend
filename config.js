const env = process.env.NODE_ENV || 'dev'

const config = {}

config.default = {
  port: 8081,
  secret: 'topsecret',
}

config.dev = {
  mongoUrl: `docker.me:27017`,
  redis: {
    port: 6379,
    host: `docker.me`,
    namespace: `LOGIN_DEV`,
  },
}

config.test = {
  port: 9123,
  mongoUrl: `docker.me:27018`,
  redis: {
    port: 6379,
    host: `docker.me`,
    namespace: `LOGIN_TEST`,
  },
}

config.prod = {
  mongoUrl: ``,
  redis: {
    port: 6379,
    host: `docker.me`,
    namespace: `LOGIN_PROD`,
  },
}

export default Object.assign({}, config.default, config[env])
