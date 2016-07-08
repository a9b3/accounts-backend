import invariant from 'invariant'
import redis from '../services/redis.js'
import User from '../models/user.js'
import { tryCatchMiddleware } from '../services/middleware-helper.js'

async function authenticate(req, res) {
  const {
    token,
  } = req.body
  invariant(token, `'token' must be provided`)

  const retreivedToken = await redis.get(`TOKEN/${token}`)
  if (!retreivedToken) throw new Error(`Token does not exist`)

  const user = await User.findOne({ email: retreivedToken.user.email })
  if (!user) throw new Error(`User does not exist`)

  res.send({
    user,
    token: retreivedToken,
  })
}

export default tryCatchMiddleware(authenticate)
