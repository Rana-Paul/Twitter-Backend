"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prismaClient = void 0;
const prisma_client_1 = require("prisma/prisma-client");
exports.prismaClient = new prisma_client_1.PrismaClient({ log: ['query'] });
