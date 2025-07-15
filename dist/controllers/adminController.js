"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.deleteTransaction = exports.updateTransaction = exports.getTransactionById = exports.addTransaction = exports.updateUser = exports.createUser = exports.getUserById = exports.getAllUsers = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const getAllUsers = (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield prisma_1.default.user.findMany({
        where: { role: "USER" },
        include: { transactions: true },
        orderBy: { createdAt: "desc" },
    });
    res.json(users);
});
exports.getAllUsers = getAllUsers;
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    const user = yield prisma_1.default.user.findUnique({ where: { id }, include: { transactions: true } });
    if (!user)
        return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(user);
});
exports.getUserById = getUserById;
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, phone, address, idNumber, accountType, accountNumber, accountStatus, balance } = req.body;
        const user = yield prisma_1.default.user.create({
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
        });
        res.status(201).json(user);
    }
    catch (error) {
        if (error.code === 'P2002') {
            res.status(400).json({ error: 'El email ya está registrado' });
        }
        else {
            console.error('Error creating user:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
});
exports.createUser = createUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        console.log('Actualizando usuario con ID:', id);
        console.log('Datos recibidos:', req.body);
        // Verificar que el usuario existe
        const existingUser = yield prisma_1.default.user.findUnique({ where: { id } });
        if (!existingUser) {
            console.log('Usuario no encontrado con ID:', id);
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        // Filtrar solo los campos que se pueden actualizar
        const { name, email, phone, address, idNumber, accountType, accountNumber, accountStatus, balance, password } = req.body;
        const updateData = {};
        if (name !== undefined)
            updateData.name = name;
        if (email !== undefined)
            updateData.email = email;
        if (phone !== undefined)
            updateData.phone = phone;
        if (address !== undefined)
            updateData.address = address;
        if (idNumber !== undefined)
            updateData.idNumber = idNumber;
        if (accountType !== undefined)
            updateData.accountType = accountType;
        if (accountNumber !== undefined)
            updateData.accountNumber = accountNumber;
        if (accountStatus !== undefined)
            updateData.accountStatus = accountStatus;
        if (balance !== undefined)
            updateData.balance = Number(balance);
        if (password !== undefined)
            updateData.password = password; // Sin hash
        console.log('Datos a actualizar:', updateData);
        const updated = yield prisma_1.default.user.update({
            where: { id },
            data: updateData,
            include: { transactions: true },
        });
        console.log('Usuario actualizado exitosamente:', updated);
        res.json(updated);
    }
    catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});
exports.updateUser = updateUser;
const addTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = Number(req.params.id);
    const { orderNumber, date, description, amount, type } = req.body;
    const transaction = yield prisma_1.default.transaction.create({
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
});
exports.addTransaction = addTransaction;
// Nuevas funciones para manejo completo de transacciones
const getTransactionById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.transactionId);
        const transaction = yield prisma_1.default.transaction.findUnique({
            where: { id },
            include: { user: true }
        });
        if (!transaction) {
            return res.status(404).json({ error: 'Transacción no encontrada' });
        }
        res.json(transaction);
    }
    catch (error) {
        console.error('Error getting transaction:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});
exports.getTransactionById = getTransactionById;
const updateTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.transactionId);
        const { orderNumber, date, description, amount, type } = req.body;
        // Verificar que la transacción existe
        const existingTransaction = yield prisma_1.default.transaction.findUnique({ where: { id } });
        if (!existingTransaction) {
            return res.status(404).json({ error: 'Transacción no encontrada' });
        }
        const updatedTransaction = yield prisma_1.default.transaction.update({
            where: { id },
            data: {
                orderNumber,
                date: new Date(date),
                description,
                amount: Number(amount),
                type,
            },
            include: { user: true }
        });
        res.json(updatedTransaction);
    }
    catch (error) {
        console.error('Error updating transaction:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});
exports.updateTransaction = updateTransaction;
const deleteTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.transactionId);
        // Verificar que la transacción existe
        const existingTransaction = yield prisma_1.default.transaction.findUnique({ where: { id } });
        if (!existingTransaction) {
            return res.status(404).json({ error: 'Transacción no encontrada' });
        }
        yield prisma_1.default.transaction.delete({
            where: { id }
        });
        res.json({ message: 'Transacción eliminada exitosamente' });
    }
    catch (error) {
        console.error('Error deleting transaction:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});
exports.deleteTransaction = deleteTransaction;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        console.log('Eliminando usuario con ID:', id);
        // Verificar que el usuario existe
        const existingUser = yield prisma_1.default.user.findUnique({ where: { id } });
        if (!existingUser) {
            console.log('Usuario no encontrado con ID:', id);
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        // Verificar que no sea un administrador
        if (existingUser.role === 'ADMIN') {
            return res.status(403).json({ error: 'No se puede eliminar un administrador' });
        }
        // Eliminar transacciones asociadas primero (cascade)
        yield prisma_1.default.transaction.deleteMany({
            where: { userId: id }
        });
        // Eliminar el usuario
        yield prisma_1.default.user.delete({
            where: { id }
        });
        console.log('Usuario eliminado exitosamente:', id);
        res.json({ message: 'Usuario eliminado exitosamente' });
    }
    catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});
exports.deleteUser = deleteUser;
