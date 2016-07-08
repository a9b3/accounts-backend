import invariant from 'invariant'
import User from '../models/user.js'
import { create } from '../services/session-token.js'
import { tryCatchMiddleware } from '../services/middleware-helper.js'

async function signup(req, res) {
  const {
    email,
    password,
  } = req.body

  invariant(email && password, `'email', 'password' must be provided`)

  const user = await User.signup({ email, password })
  const token = await create(user)

  res.send({
    user,
    token,
  })
  // TODO send verification email here
}

export default tryCatchMiddleware(signup)
