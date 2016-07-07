import { Router } from 'express'
import { middleware as requireAuthentication } from './services/session-token.js'
import signup from './controllers/signup.js'
import authenticate from './controllers/authenticate.js'
import verify from './controllers/verify.js'

const router = new Router()

router.post(`/api/signup`, signup)
router.post(`/api/authenticate`, authenticate)
router.post(`/api/verify`, verify)

export default router
