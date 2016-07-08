import expect from 'expect'
import axios from 'axios'
import Server from '../src/server.js'
import config from '../config.js'
import mongooseDb from '../src/services/mongoose-db.js'
import redis from '../src/services/redis.js'
import User from '../src/models/user.js'

describe('e2e testing', () => {
  let server

  beforeEach(async done => {
    server = new Server()
    await server.initialize(config)
    server.listen(config.port)
    .then(() => done())
    .catch(done)
  })

  afterEach(async done => {
    await mongooseDb.dangerouslyDropDb()
    await redis.flushDb()
    server.stop()
    .then(() => done())
    .catch(done)
  })

  const fakeUser = {
    email: 'fake@fakeaf',
    password: 'fakestuff',
  }

  describe(`/api/signup`, () => {
    it(`should create user`, async () => {
      const res = await axios.post(`http://127.0.0.1:${config.port}/api/signup`, fakeUser)
      expect(res).toExist()
      expect(res.status).toBe(200)
      expect(res.data.user.email).toBe(fakeUser.email)
      expect(res.data.token).toExist()

      const foundUser = await User.findOne({ email: fakeUser.email }).exec()
      expect(foundUser).toExist()

      const foundToken = await redis.get(`TOKEN/${res.data.token.token}`)
      expect(foundToken).toExist()
    })

    it('should not create user if already exists', async () => {
      const res = await axios.post(`http://127.0.0.1:${config.port}/api/signup`, fakeUser)

      try {
        const secondTry = await axios.post(`http://127.0.0.1:${config.port}/api/signup`, fakeUser)
      } catch (e) {
        expect(e).toExist()
        expect(e.status).toBe(500)
      }
    })

    it('should not work if not given required params', async () => {
      try {
        const res = await axios.post(`http://127.0.0.1:${config.port}/api/signup`, {})
      } catch (e) {
        expect(e).toExist()
        expect(e.status).toBe(500)
      }
    })
  })

  describe('/api/authenticate', () => {
    it('should work with valid user', async () => {
      await axios.post(`http://127.0.0.1:${config.port}/api/signup`, fakeUser)

      const res = await axios.post(`http://127.0.0.1:${config.port}/api/authenticate`, fakeUser)
      expect(res).toExist()
      expect(res.status).toBe(200)
      expect(res.data).toExist()
      expect(res.data.user.email).toBe(fakeUser.email)
      expect(res.data.user.password).toNotExist()
      expect(res.data.token).toExist()
    })

    it('should not work with invalid user', async () => {
      await axios.post(`http://127.0.0.1:${config.port}/api/signup`, fakeUser)

      try {
        const res = await axios.post(`http://127.0.0.1:${config.port}/api/authenticate`, {
          email: 'yo@yo',
          password: '123',
        })
      } catch (e) {
        expect(e).toExist()
        expect(e.status).toBe(500)
      }
    })

    it('should not work without params', async () => {
      try {
        const res = await axios.post(`http://127.0.0.1:${config.port}/api/authenticate`, {

        })
      } catch (e) {
        expect(e).toExist()
        expect(e.status).toBe(500)
      }
    })
  })

  describe('/api/verify', () => {
    it('should work with valid jwt', async () => {
      await axios.post(`http://127.0.0.1:${config.port}/api/signup`, fakeUser)
      const res = await axios.post(`http://127.0.0.1:${config.port}/api/authenticate`, fakeUser)
      const jwt = res.data.token.token

      const verify = await axios.post(`http://127.0.0.1:${config.port}/api/verify`, {
        token: jwt,
      })
      expect(verify).toExist()
      expect(verify.status).toBe(200)
    })

    it('should not work with invalid jwt', async () => {
      try {
        const verify = await axios.post(`http://127.0.0.1:${config.port}/api/verify`, {
          token: 'askdjaklsdj',
        })
      } catch (e) {
        expect(e).toExist()
        expect(e.status).toBe(500)
      }
    })
  })
})
