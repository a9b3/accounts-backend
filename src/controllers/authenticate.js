import invariant from 'invariant'
import User from '../models/user.js'
import { create } from '../services/session-token.js'
import { tryCatchMiddleware } from '../services/middleware-helper.js'

async function login(req, res) {
  const {
    email,
    password,
    // optional parameter, redirects to origin upon successful authentication
    origin,
  } = req.body

  invariant(email && password, `'email', 'password' must be provided`)

  const user = await User.login({ email, password })
  const token = await create(user)

  res.send({
    user,
    token,
    origin,
  })
}

export default tryCatchMiddleware(login)
