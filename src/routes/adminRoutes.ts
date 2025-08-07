import { Router } from "express";
import {
    getAllUsers,
    createUser,
    updateUser,
    addTransaction,
    getUserById,
    deleteUser,
    getTransactionById,
    updateTransaction,
    deleteTransaction,
    getAdminStats,
  } from "../controllers/adminController";
  import { verifyToken } from "../middlewares/authMiddleware";
  import { isAdmin } from "../middlewares/isAdmin";

const router = Router();

router.use(verifyToken, isAdmin);

// Nueva ruta para estadísticas del administrador
router.get('/stats', getAdminStats)

router.get('/users', getAllUsers)
router.post('/users', createUser)
router.get('/users/:id', getUserById)
router.put('/users/:id', updateUser)
router.delete('/users/:id', deleteUser)

router.post('/users/:id/transactions', addTransaction)

// Nuevas rutas para manejo completo de transacciones
router.get('/transactions/:transactionId', getTransactionById)
router.put('/transactions/:transactionId', updateTransaction)
router.delete('/transactions/:transactionId', deleteTransaction)

export default router;
