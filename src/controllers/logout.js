import invariant from 'invariant'
import { remove } from '../services/session-token.js'
import { tryCatchMiddleware } from '../services/middleware-helper.js'

async function logout(req, res) {
  const {
    token,
  } = req.body

  invariant(token, `'token' must be provided`)

  const reply = await remove(token)

  res.send({
    message: `ok`,
  })
}

export default tryCatchMiddleware(logout)
