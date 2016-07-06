import User from '../models/user.js'

export default async function signup(req, res) {
  const credentials = req.body

  const user = await User.signup(credentials)
}
