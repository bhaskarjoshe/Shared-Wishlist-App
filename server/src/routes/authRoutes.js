import express from 'express'
import { signIn, signUp } from '../controllers/authController.js'

const router = express.Router()

router.post('/api/signUp', signUp)
router.post('/api/signIn', signIn)

export default router

