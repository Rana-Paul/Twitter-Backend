"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ioredis_1 = __importDefault(require("ioredis"));
const redisClient = new ioredis_1.default("redis://default:772a8d7948944cfdb73dfb811520e8d6@us1-ample-crane-41005.upstash.io:41005");
exports.default = redisClient;
