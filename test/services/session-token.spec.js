import redis from '../../src/services/redis.js'
import * as sessionToken from '../../src/services/session-token.js'
import expect from 'expect'
import config from '../../config.js'

function timeoutPromise(cb, ms) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      cb()
      .then(() => {
        resolve()
      })
      .catch(reject)
    }, ms)
  })
}

describe('services/session-token', () => {
  beforeEach(() => {
    redis.initialize(config.redis)
  })

  afterEach(async done => {
    await redis.flushDb()
    done()
  })

  const fakeUser = {
    id: '123',
    email: 'fake@fakeaf',
  }

  describe(`create()`, () => {
    it('should work', async () => {
      const tokenData = await sessionToken.create(fakeUser)
      expect(tokenData).toExist()
      expect(tokenData.user.email).toBe(fakeUser.email)
      expect(tokenData.user.id).toBe(fakeUser.id)
      const redisValue = await redis.get(`TOKEN/${tokenData.token}`)
      expect(redisValue).toExist()
      expect(redisValue.user.email).toBe(fakeUser.email)
      expect(redisValue.user.id).toBe(fakeUser.id)
    })

    it(`should expire`, async () => {
      const expiresIn = 1
      const tokenData = await sessionToken.create(Object.assign({}, fakeUser, {
        expiresIn,
      }))
      await timeoutPromise(async () => {
        const redisValue = await redis.get(`TOKEN/${tokenData.token}`)
        expect(redisValue).toNotExist()
      }, 1100)
    })
  })

  describe(`remove()`, () => {
    it(`should work`, async () => {
      const tokenData = await sessionToken.create(fakeUser)
      const beforeKeys = await redis.keys()
      expect(beforeKeys.length).toBe(1)

      await sessionToken.remove(tokenData.token)
      const afterKeys = await redis.keys()
      expect(afterKeys.length).toBe(0)
    })
  })
})
