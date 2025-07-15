"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = void 0;
const isAdmin = (req, res, next) => {
    const user = req.user;
    if ((user === null || user === void 0 ? void 0 : user.role) !== 'ADMIN') {
        return res.status(403).json({ message: 'Acceso denegado' });
    }
    next();
};
exports.isAdmin = isAdmin;
