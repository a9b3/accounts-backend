import invariant from 'invariant'
import User from '../models/user.js'
import { tryCatchMiddleware } from '../services/middleware-helper.js'

async function getUser(req, res) {
  const {
    id,
  } = req.query

  invariant(id, `'id' must be provided`)

  const user = await User.findOne({ id })

  res.send({
    user,
  })
}

export default tryCatchMiddleware(getUser)
