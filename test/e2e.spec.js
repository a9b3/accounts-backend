import should from 'should'
import axios from 'axios'
import Server from '../src/server.js'
import config from '../config.js'
import mongooseDb from '../src/services/mongoose-db.js'
import redis from '../src/services/redis.js'

describe('e2e testing', () => {
  // let server
  //
  // beforeEach(async done => {
  //   server = new Server()
  //   await server.initialize(config)
  //   server.listen()
  //   .then(() => done())
  //   .catch(done)
  // })
  //
  // afterEach(async done => {
  //   await mongooseDb.dangerouslyDropDb()
  //   await redis.flushDb()
  //   server.stop()
  //   .then(() => done())
  //   .catch(done)
  // })
  //
  // const fakeUser = {
  //   email: 'fake@fakeaf',
  //   password: 'fakestuff',
  // }
  //
  // describe(`/api/signup`, () => {
  //   it(`should create user`, async () => {
  //     await axios.post(`http://localhost:${config.port}/api/signup`, fakeUser)
  //   })
  // })
})
