import jwt from 'jsonwebtoken'
import invariant from 'invariant'
import redis from './redis.js'
import config from '../../config.js'

const TOKEN = `TOKEN`
const TOKEN_EXPIRE_WEEK = 1
const TOKEN_EXPIRE_DAY = TOKEN_EXPIRE_WEEK * 7
const TOKEN_EXPIRE_HOUR = TOKEN_EXPIRE_DAY * 24
const TOKEN_EXPIRE_MIN = TOKEN_EXPIRE_HOUR * 60
const TOKEN_EXPIRE_SEC = TOKEN_EXPIRE_MIN * 60

export async function middleware(req, res, next) {
  const token = req.headers && req.headers['session-token']

  if (!token) return next('Must provide session-token in headers')

  jwt.verify(token, config.secret, async e => {
    if (e) next(e)

    const tokenData = await redis.get(`${TOKEN}/${token}`)
    if (!tokenData) return next('Token not found')
    req.user = tokenData
    next()
  })
  .catch(next)
}

export async function create({
  id,
  email,
  expiresIn = TOKEN_EXPIRE_SEC,
}) {
  invariant(id && email, `'id', 'email' must be provided`)
  const token = jwt.sign({
    id,
  }, config.secret, {
    expiresIn,
  })
  const decoded = jwt.decode(token)

  const tokenData = {
    user: {
      email,
      id,
    },
    token,
    tokenExp: decoded.exp,
    tokenIat: decoded.iat,
  }

  const setReply = await redis.set(`${TOKEN}/${tokenData.token}`, tokenData)
  if (!setReply) throw new Error(`Token not set in redis`)
  const expireReply = await redis.expire(`${TOKEN}/${tokenData.token}`, expiresIn)
  if (!expireReply) throw new Error(`Token expiration not set in redis`)
  return tokenData
}

export async function remove(token) {
  return redis.del(`${TOKEN}/${token}`)
}
