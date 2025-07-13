import { Request, Response } from 'express'
import { validateUser, createUser } from '../services/authService'
import { generateToken } from '../utils/jwt'
import prisma from '../utils/prisma'

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña son obligatorios' })
  }

  const user = await validateUser(email, password)
  if (!user) {
    return res.status(401).json({ error: 'Credenciales inválidas' })
  }

  const token = generateToken(user.id)
  res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role,  }, token })
}

export const register = async (req: Request, res: Response) => {
  const { email, password, name } = req.body
  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' })
  }

  try {
    const newUser = await createUser(email, password, name)
    res.status(201).json({ id: newUser.id, email: newUser.email })
  } catch (err) {
    res.status(400).json({ error: 'Email ya registrado' })
  }
}

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user
    
    if (!user) {
      return res.status(401).json({ error: 'No autorizado' })
    }

    // Obtener información completa del usuario incluyendo transacciones
    const fullUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        transactions: {
          orderBy: { date: 'desc' },
          take: 10 // Solo las últimas 10 transacciones
        }
      }
    })

    if (!fullUser) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    res.json({
      user: {
        id: fullUser.id,
        name: fullUser.name,
        email: fullUser.email,
        role: fullUser.role,
        balance: fullUser.balance,
        accountType: fullUser.accountType,
        accountNumber: fullUser.accountNumber,
        accountStatus: fullUser.accountStatus,
        phone: fullUser.phone,
        address: fullUser.address,
        idNumber: fullUser.idNumber,
        transactions: fullUser.transactions
      }
    })
  } catch (error) {
    console.error('Error getting current user:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

export const logout = async (req: Request, res: Response) => {
  try {
    // En una implementación real, aquí podrías invalidar el token
    // Por ahora, simplemente respondemos con éxito
    res.json({ message: 'Logout exitoso' })
  } catch (error) {
    console.error('Error during logout:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}