const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function createAdmini1() {
  try {
    const adminEmail = 'admin1@pruebas.com';
    const adminPassword = 'admin1';
    
    // Check if admin already exists
    const existing = await prisma.user.findUnique({ 
      where: { email: adminEmail } 
    });
    
    if (existing) {
      console.log('🟡 Admini1 ya existe:', adminEmail);
      return;
    }
    
    
    // Create the new admin
    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        password: adminPassword,
        name: 'Administrador Admini1',
        role: 'ADMIN',
      },
    });
    
    console.log('✅ Admini1 creado exitosamente:');
    console.log('Email:', admin.email);
    console.log('Nombre:', admin.name);
    console.log('Rol:', admin.role);
    console.log('ID:', admin.id);
    
  } catch (error) {
    console.error('❌ Error al crear admini1:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmini1(); 