import { Router } from 'express'
import { UserController } from '../controllers/user.controller'
import api from './api.instance'
import protection from '../controllers/protection.middleware'

const router = Router()
const controller = new UserController()

router.post(api.create(), controller.createUser)
router.post(api.login(), controller.login)
router.post(api.refresh(), controller.refreshAccessToken)
router.get(api.info(), protection, controller.getInfo)

export default router
