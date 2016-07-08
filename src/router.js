import { Router } from 'express'
import { middleware as requireAuthentication } from './services/session-token.js'
import signup from './controllers/signup.js'
import authenticate from './controllers/authenticate.js'
import verify from './controllers/verify.js'
import logout from './controllers/logout.js'
import getUser from './controllers/getUser.js'
import lastErrorHandler from 'express-last-error-handler'
import cors from 'cors'

const router = new Router()

router.post(`/api/signup`, signup)
router.post(`/api/authenticate`, authenticate)
router.post(`/api/verify`, verify)
router.post(`/api/logout`, logout)
router.get(`/api/getUser`, requireAuthentication, getUser)
router.use(lastErrorHandler)

export default router
