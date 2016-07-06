import mongoose, { Schema } from 'mongoose'
import bcrypt from 'bcrypt'
import uuid from 'node-uuid'
import invariant from 'invariant'

const MONGOOSE_KEY = 'User'

function generateHash(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
}

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
  verified: {
    type: Boolean,
    required: true,
  },
})

UserSchema.statics.signup = async function create({
  email,
  password,
}) {
  invariant(email && password, `'email' and 'password' must be provided`)

  // if existing user throw error
  const existingUser = await this.findOne({ email }).exec()
  if (existingUser) throw new Error(`Email ${email} already exist`)

  // create user
  const User = this.model(MONGOOSE_KEY)
  const newUser = new User({
    email,
    password: generateHash(password),
    verified: false,
    id: uuid.v4(),
  })
  return await newUser.save()
}

UserSchema.statics.login = async function login({
  email,
  password,
}) {
  invariant(email && password, `'email' and 'password' must be provided`)
}

let User
try {
  User = mongoose.model(MONGOOSE_KEY, UserSchema)
} catch (e) {
  User = mongoose.model(MONGOOSE_KEY)
}
export default User
