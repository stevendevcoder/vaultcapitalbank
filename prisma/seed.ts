import { PrismaClient } from '../src/generated/prisma'
import { hashPassword } from '../src/utils/hash'

const prisma = new PrismaClient()

async function main() {
  const adminEmail = 'admin@atlasbank.com'
  const existing = await prisma.user.findUnique({ where: { email: adminEmail } })

  if (existing) {
    console.log('🟡 Admin ya existe:', adminEmail)
    return
  }

  const hashed = 'admin123'

  const admin = await prisma.user.create({
    data: {
      email: adminEmail,
      password: hashed,
      name: 'Administrador Atlas',
      role: 'ADMIN',
    },
  })

  console.log('✅ Admin creado:', admin)
}

main()
  .catch((e) => {
    console.error('❌ Error al hacer seed:', e)
    process.exit(1)
  })
  .finally(() => {
    prisma.$disconnect()
  })
