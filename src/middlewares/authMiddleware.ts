// src/middlewares/authMiddleware.ts
import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import prisma from '../utils/prisma'

const JWT_SECRET = process.env.JWT_SECRET || 'defaultsecret'

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No autorizado' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number }

    const user = await prisma.user.findUnique({ where: { id: decoded.id } })
    if (!user) return res.status(403).json({ error: 'Token inválido' })

    ;(req as any).user = user
    next()
  } catch {
    res.status(401).json({ error: 'Token inválido' })
  }
}
