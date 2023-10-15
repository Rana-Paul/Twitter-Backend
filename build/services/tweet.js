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
const db_1 = require("../client/db");
const redis_1 = __importDefault(require("../client/redis"));
class TweetService {
    static createTweet(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const rateLimit = yield redis_1.default.get(`RATE_LIMIT:TWEET:${data.userId}`);
            if (rateLimit)
                throw new Error("Please wait 30 seconds before posting another tweet");
            const tweet = yield db_1.prismaClient.tweet.create({
                data: {
                    content: data.content,
                    imageURL: data.imageURL,
                    authorId: data.userId
                }
            });
            yield redis_1.default.setex(`RATE_LIMIT:TWEET:${data.userId}`, 15, 1);
            yield redis_1.default.del("ALL_TWEETS");
            return tweet;
        });
    }
    static getAllTweet() {
        return __awaiter(this, void 0, void 0, function* () {
            const cachedTweets = yield redis_1.default.get("ALL_TWEETS");
            if (cachedTweets)
                return JSON.parse(cachedTweets);
            const tweets = yield db_1.prismaClient.tweet.findMany({ orderBy: { createdAt: "desc" } });
            yield redis_1.default.set("ALL_TWEETS", JSON.stringify(tweets));
            return tweets;
        });
    }
    static deleteTweet(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.prismaClient.tweet.delete({ where: { id } });
            yield redis_1.default.del("ALL_TWEETS");
            return true;
        });
    }
}
exports.default = TweetService;
