import { Router } from 'express'
import { middleware as requireAuthentication } from './services/session-token.js'
import signup from './controllers/signup.js'
import login from './controllers/login.js'
import authenticate from './controllers/authenticate.js'

const router = new Router()

router.post(`/api/signup`, signup)
router.post(`/api/login`, login)
router.post(`/api/authenticate`, authenticate)

export default router
