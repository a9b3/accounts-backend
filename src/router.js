import { Router } from 'express'
import { middleware as requireAuthentication } from './services/session-token.js'
import signup from './controllers/signup.js'
import authenticate from './controllers/authenticate.js'
import verify from './controllers/verify.js'
import logout from './controllers/logout.js'
import lastErrorHandler from 'express-last-error-handler'
import cors from 'cors'

const router = new Router()

router.post(`/api/signup`, cors(), signup)
router.post(`/api/authenticate`, cors(), authenticate)
router.post(`/api/verify`, cors(), verify)
router.post(`/api/logout`, cors(), logout)
router.get(`/test`, cors(), (req, res) => {
  res.send('testing')
})
router.use(lastErrorHandler)

export default router
