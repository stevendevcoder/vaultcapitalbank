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
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../src/generated/prisma");
const prisma = new prisma_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const adminEmail = 'admin@atlasbank.com';
        const existing = yield prisma.user.findUnique({ where: { email: adminEmail } });
        if (existing) {
            console.log('🟡 Admin ya existe:', adminEmail);
            return;
        }
        const hashed = 'admin123';
        const admin = yield prisma.user.create({
            data: {
                email: adminEmail,
                password: hashed,
                name: 'Administrador Vault',
                role: 'ADMIN',
            },
        });
        console.log('✅ Admin creado:', admin);
    });
}
main()
    .catch((e) => {
    console.error('❌ Error al hacer seed:', e);
    process.exit(1);
})
    .finally(() => {
    prisma.$disconnect();
});
