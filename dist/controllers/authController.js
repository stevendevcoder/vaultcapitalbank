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
exports.logout = exports.getCurrentUser = exports.register = exports.login = void 0;
const authService_1 = require("../services/authService");
const jwt_1 = require("../utils/jwt");
const prisma_1 = __importDefault(require("../utils/prisma"));
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email y contraseña son obligatorios' });
    }
    const user = yield (0, authService_1.validateUser)(email, password);
    if (!user) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    const token = (0, jwt_1.generateToken)(user.id);
    res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role, }, token });
});
exports.login = login;
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }
    try {
        const newUser = yield (0, authService_1.createUser)(email, password, name);
        res.status(201).json({ id: newUser.id, email: newUser.email });
    }
    catch (err) {
        res.status(400).json({ error: 'Email ya registrado' });
    }
});
exports.register = register;
const getCurrentUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ error: 'No autorizado' });
        }
        // Obtener información completa del usuario incluyendo transacciones
        const fullUser = yield prisma_1.default.user.findUnique({
            where: { id: user.id },
            include: {
                transactions: {
                    orderBy: { date: 'desc' },
                    take: 10 // Solo las últimas 10 transacciones
                }
            }
        });
        if (!fullUser) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
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
        });
    }
    catch (error) {
        console.error('Error getting current user:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});
exports.getCurrentUser = getCurrentUser;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // En una implementación real, aquí podrías invalidar el token
        // Por ahora, simplemente respondemos con éxito
        res.json({ message: 'Logout exitoso' });
    }
    catch (error) {
        console.error('Error during logout:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});
exports.logout = logout;
