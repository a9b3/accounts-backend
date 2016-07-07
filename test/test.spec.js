import should from 'should'
import axios from 'axios'
import Server from '../src/server.js'
import config from '../config.js'

describe('test works', () => {
  let server

  beforeEach(done => {
    server = new Server()
    server.listen()
    .then(() => done())
    .catch(done)
  })

  afterEach(done => {
    server.stop()
    .then(() => done())
    .catch(done)
  })
})
