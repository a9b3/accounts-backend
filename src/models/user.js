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

UserSchema.set('toJSON', {
  transform(doc, ret) {
    const retJson = {
      email: ret.email,
      id: ret.id,
      verified: ret.verified,
    }
    return retJson
  },
})

UserSchema.methods.validPassword = function validPassword(password) {
  return bcrypt.compareSync(password, this.password)
}

UserSchema.statics.signup = async function signup({
  email,
  password,
}) {
  invariant(email && password, `'email' and 'password' must be provided`)

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
  const createdUser = await newUser.save()
  return createdUser.toJSON()
}

UserSchema.statics.login = async function login({
  email,
  password,
}) {
  invariant(email && password, `'email' and 'password' must be provided`)

  const existingUser = await this.findOne({ email }).exec()
  if (!existingUser) throw new Error(`Email ${email} does not exist`)
  if (!existingUser.validPassword(password)) {
    throw new Error(`Invalid password`)
  }
  return existingUser.toJSON()
}

let User
try {
  User = mongoose.model(MONGOOSE_KEY, UserSchema)
} catch (e) {
  User = mongoose.model(MONGOOSE_KEY)
}
export default User
