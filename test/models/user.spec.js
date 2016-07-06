import mongooseDb from '../../src/services/mongoose-db.js'
import User from '../../src/models/user.js'
import config from '../../config.js'
import expect from 'expect'

describe('models/user', () => {
  beforeEach(done => {
    mongooseDb.start({
      url: config.mongoUrl,
    })
    .then(() => done())
    .catch(done)
  })

  afterEach(done => {
    mongooseDb.dangerouslyDropDb()
    .then(() => mongooseDb.stop())
    .then(() => done())
    .catch(done)
  })

  const fakeUserCredentials = {
    email: 'fake@fake.com',
    password: 'fakeaf',
  }

  it('signup user', async () => {
    const user = await User.signup(fakeUserCredentials)
    expect(user).toExist()
    expect(user.email).toBe(fakeUserCredentials.email)
    expect(user.password).toNotExist()

    const found = await User.find({ email: fakeUserCredentials.email })
    expect(found.length).toBe(1)
    expect(found[0].email).toBe(fakeUserCredentials.email)
  })

  it('login user', async () => {
    await User.signup(fakeUserCredentials)
    const user = await User.login(fakeUserCredentials)
    expect(user).toExist()
    expect(user.email).toBe(fakeUserCredentials.email)
    expect(user.password).toNotExist()
  })
})
