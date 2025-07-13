import { Request, Response } from 'express'
import prisma from '../utils/prisma'

export const getAllUsers = async (_: Request, res: Response) => {
    const users = await prisma.user.findMany({
      where: { role: "USER" },
      include: { transactions: true },
      orderBy: { createdAt: "desc" },
    });
    res.json(users);
  };

export const getUserById = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id)
  const user = await prisma.user.findUnique({ where: { id }, include: { transactions: true } })
  if (!user) return res.status(404).json({ error: 'Usuario no encontrado' })
  res.json(user)
}

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone, address, idNumber, accountType, accountNumber, accountStatus, balance } = req.body

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password, // Sin hash como solicitaste
        phone,
        address,
        idNumber,
        accountType,
        accountNumber,
        accountStatus,
        balance: Number(balance) || 0,
      },
      include: { transactions: true },
    })

    res.status(201).json(user)
  } catch (error: any) {
    if (error.code === 'P2002') {
      res.status(400).json({ error: 'El email ya está registrado' })
    } else {
      console.error('Error creating user:', error)
      res.status(500).json({ error: 'Error interno del servidor' })
    }
  }
}

  export const updateUser = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      console.log('Actualizando usuario con ID:', id);
      console.log('Datos recibidos:', req.body);
      
      // Verificar que el usuario existe
      const existingUser = await prisma.user.findUnique({ where: { id } });
      if (!existingUser) {
        console.log('Usuario no encontrado con ID:', id);
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      // Filtrar solo los campos que se pueden actualizar
      const { name, email, phone, address, idNumber, accountType, accountNumber, accountStatus, balance, password } = req.body;
      
      const updateData: any = {};
      if (name !== undefined) updateData.name = name;
      if (email !== undefined) updateData.email = email;
      if (phone !== undefined) updateData.phone = phone;
      if (address !== undefined) updateData.address = address;
      if (idNumber !== undefined) updateData.idNumber = idNumber;
      if (accountType !== undefined) updateData.accountType = accountType;
      if (accountNumber !== undefined) updateData.accountNumber = accountNumber;
      if (accountStatus !== undefined) updateData.accountStatus = accountStatus;
      if (balance !== undefined) updateData.balance = Number(balance);
      if (password !== undefined) updateData.password = password; // Sin hash

      console.log('Datos a actualizar:', updateData);

      const updated = await prisma.user.update({
        where: { id },
        data: updateData,
        include: { transactions: true },
      });
      
      console.log('Usuario actualizado exitosamente:', updated);
      res.json(updated);
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };

export const addTransaction = async (req: Request, res: Response) => {
  const userId = Number(req.params.id);
  const { orderNumber, date, description, amount, type } = req.body;

  const transaction = await prisma.transaction.create({
    data: {
      orderNumber,
      date: new Date(date),
      description,
      amount,
      type,
      userId,
    },
  });

  res.status(201).json(transaction);
};

// Nuevas funciones para manejo completo de transacciones
export const getTransactionById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.transactionId)
    const transaction = await prisma.transaction.findUnique({ 
      where: { id },
      include: { user: true }
    })
    
    if (!transaction) {
      return res.status(404).json({ error: 'Transacción no encontrada' })
    }
    
    res.json(transaction)
  } catch (error) {
    console.error('Error getting transaction:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

export const updateTransaction = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.transactionId)
    const { orderNumber, date, description, amount, type } = req.body

    // Verificar que la transacción existe
    const existingTransaction = await prisma.transaction.findUnique({ where: { id } })
    if (!existingTransaction) {
      return res.status(404).json({ error: 'Transacción no encontrada' })
    }

    const updatedTransaction = await prisma.transaction.update({
      where: { id },
      data: {
        orderNumber,
        date: new Date(date),
        description,
        amount: Number(amount),
        type,
      },
      include: { user: true }
    })

    res.json(updatedTransaction)
  } catch (error) {
    console.error('Error updating transaction:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

export const deleteTransaction = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.transactionId)
    
    // Verificar que la transacción existe
    const existingTransaction = await prisma.transaction.findUnique({ where: { id } })
    if (!existingTransaction) {
      return res.status(404).json({ error: 'Transacción no encontrada' })
    }

    await prisma.transaction.delete({
      where: { id }
    })
    
    res.json({ message: 'Transacción eliminada exitosamente' })
  } catch (error) {
    console.error('Error deleting transaction:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    console.log('Eliminando usuario con ID:', id);
    
    // Verificar que el usuario existe
    const existingUser = await prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      console.log('Usuario no encontrado con ID:', id);
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Verificar que no sea un administrador
    if (existingUser.role === 'ADMIN') {
      return res.status(403).json({ error: 'No se puede eliminar un administrador' });
    }

    // Eliminar transacciones asociadas primero (cascade)
    await prisma.transaction.deleteMany({
      where: { userId: id }
    });

    // Eliminar el usuario
    await prisma.user.delete({
      where: { id }
    });
    
    console.log('Usuario eliminado exitosamente:', id);
    res.json({ message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};