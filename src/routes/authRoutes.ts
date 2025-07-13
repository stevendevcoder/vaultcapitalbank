// src/routes/authRoutes.ts
import { Router } from 'express'
import { login, getCurrentUser, logout } from '../controllers/authController'
import { verifyToken } from '../middlewares/authMiddleware'

const router = Router()

router.post('/login', login)
router.get('/me', verifyToken, getCurrentUser)
router.post('/logout', verifyToken, logout)

export default router
