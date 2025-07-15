"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminController_1 = require("../controllers/adminController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const isAdmin_1 = require("../middlewares/isAdmin");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.verifyToken, isAdmin_1.isAdmin);
router.get('/users', adminController_1.getAllUsers);
router.post('/users', adminController_1.createUser);
router.get('/users/:id', adminController_1.getUserById);
router.put('/users/:id', adminController_1.updateUser);
router.delete('/users/:id', adminController_1.deleteUser);
router.post('/users/:id/transactions', adminController_1.addTransaction);
// Nuevas rutas para manejo completo de transacciones
router.get('/transactions/:transactionId', adminController_1.getTransactionById);
router.put('/transactions/:transactionId', adminController_1.updateTransaction);
router.delete('/transactions/:transactionId', adminController_1.deleteTransaction);
exports.default = router;
