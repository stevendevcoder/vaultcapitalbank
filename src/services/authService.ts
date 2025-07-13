
import prisma from '../utils/prisma'

export const validateUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return null

  // Comparación directa sin hash
  if (password !== user.password) return null

  return user
}

export const createUser = async (email: string, password: string, name: string) => {
  return await prisma.user.create({
    data: { email, password, name },
  })
}
