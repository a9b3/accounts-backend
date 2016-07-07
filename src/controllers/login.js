import invariant from 'invariant'
import User from '../models/user.js'
import { create } from '../services/session-token.js'

export default async function login(req, res) {
  const {
    email,
    password,
  } = req.body

  invariant(email && password, `'email', 'password' must be provided`)

  const user = await User.login({ email, password })
  const token = await create(user)

  res.send({
    user,
    token,
  })
}
