"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/authRoutes.ts
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
router.post('/login', authController_1.login);
router.get('/me', authMiddleware_1.verifyToken, authController_1.getCurrentUser);
router.post('/logout', authMiddleware_1.verifyToken, authController_1.logout);
exports.default = router;
