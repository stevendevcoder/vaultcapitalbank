const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function updateAdminPassword() {
  try {
    // Buscar el usuario admin
    const admin = await prisma.user.findUnique({
      where: { email: 'admin@atlas.com' }
    })

    if (!admin) {
      console.log('❌ Usuario admin no encontrado')
      return
    }

    console.log('👤 Usuario admin encontrado:', admin.name)

    // Actualizar la contraseña a texto plano (por ejemplo: "admin123")
    const newPassword = 'admin123'
    
    await prisma.user.update({
      where: { email: 'admin@atlas.com' },
      data: { password: newPassword }
    })

    console.log('✅ Contraseña del admin actualizada exitosamente')
    console.log('📧 Email: admin@atlas.com')
    console.log('🔑 Nueva contraseña: admin123')
    console.log('⚠️  Recuerda cambiar esta contraseña después del primer login')

  } catch (error) {
    console.error('❌ Error actualizando contraseña:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updateAdminPassword() 