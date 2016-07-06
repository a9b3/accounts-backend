import redis from '../../src/services/redis.js'
import expect from 'expect'

describe('services/redis', () => {
  const TESTNS = 'TESTING_REDIS'

  beforeEach(() => {
    redis.initialize({
      namespace: TESTNS,
    })
  })

  afterEach(async done => {
    await redis.flushDb()
    done()
  })

  it('redis functions should have promisified', async () => {
    expect(redis).toExist()
    expect(redis.getClient().getAsync).toExist()
  })

  describe('redis.keys()', () => {
    it('return an Array', async () => {
      const keys = await redis.keys()
      expect(keys).toBeA(Array)
    })

    it('set a key should return Array of 1', async () => {
      await redis.set(`foo`, 123)
      const keys = await redis.keys()
      expect(keys.length).toBe(1)
      expect(keys[0]).toBe(`${TESTNS}/foo`)
    })
  })

  describe('redis.set()', () => {
    it('123 should set key', async () => {
      const foo = `123`
      await redis.getClient().setAsync(`testing/foo`, foo)
      const res = await redis.getClient().getAsync(`testing/foo`)
      expect(res).toBe(foo)
    })
  })
})
