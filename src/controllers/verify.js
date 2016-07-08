import invariant from 'invariant'
import redis from '../services/redis.js'
import { tryCatchMiddleware } from '../services/middleware-helper.js'

async function authenticate(req, res) {
  const {
    token,
  } = req.body
  invariant(token, `'token' must be provided`)

  const retreivedToken = await redis.get(`TOKEN/${token}`)
  if (!retreivedToken) throw new Error(`Token does not exist`)

  res.send({
    token: retreivedToken,
  })
}

export default tryCatchMiddleware(authenticate)
