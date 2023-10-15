import Redis from "ioredis"

const redisClient = new Redis("redis://default:772a8d7948944cfdb73dfb811520e8d6@us1-ample-crane-41005.upstash.io:41005");

export default redisClient;
