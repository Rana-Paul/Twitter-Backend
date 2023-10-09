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
exports.resolvers = void 0;
const db_1 = require("../../client/db");
const user_1 = __importDefault(require("../../services/user"));
const queries = {
    verifyGoogleToken: (parent, { token }) => __awaiter(void 0, void 0, void 0, function* () {
        return yield user_1.default.verifyGoogleAuthToken(token);
    }),
    getCurrentUser: (parent, args, ctx) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const id = (_a = ctx.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!id)
            return null;
        const user = yield user_1.default.getUserByID(id);
        return user;
    }),
    getUserById: (parent, { id }, ctx) => __awaiter(void 0, void 0, void 0, function* () {
        return yield user_1.default.getUserByID(id);
    })
};
const mutations = {
    followUser: (parent, { to }, ctx) => __awaiter(void 0, void 0, void 0, function* () {
        var _b;
        if (!ctx.user || !ctx.user.id)
            throw new Error("You must be logged in to follow a user");
        yield user_1.default.followUser((_b = ctx.user) === null || _b === void 0 ? void 0 : _b.id, to);
        return true;
    }),
    unfollowUser: (parent, { to }, ctx) => __awaiter(void 0, void 0, void 0, function* () {
        var _c;
        if (!ctx.user || !ctx.user.id)
            throw new Error("You must be logged in to follow a user");
        yield user_1.default.unfollowUser((_c = ctx.user) === null || _c === void 0 ? void 0 : _c.id, to);
        return true;
    })
};
const extraResolvers = {
    User: {
        tweets: (parent) => {
            return db_1.prismaClient.tweet.findMany({
                where: { authorId: parent.id },
            });
        },
        followers: (parent) => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield db_1.prismaClient.follows.findMany({
                where: { following: { id: parent.id } },
                include: {
                    follower: true,
                }
            });
            console.log(result);
            return result.map(el => el.follower);
        }),
        following: (parent) => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield db_1.prismaClient.follows.findMany({
                where: { follower: { id: parent.id } },
                include: {
                    following: true,
                }
            });
            console.log(result);
            return result.map(el => el.following);
        }),
        recommendedUsers: (parent, _, ctx) => __awaiter(void 0, void 0, void 0, function* () {
            var _d, _e;
            if (!ctx.user || !ctx.user.id)
                return [];
            const myFollowings = yield db_1.prismaClient.follows.findMany({
                where: { follower: { id: (_d = ctx.user) === null || _d === void 0 ? void 0 : _d.id } },
                include: {
                    following: { include: { followers: { include: { following: true } } } },
                },
            });
            const user = [];
            for (const following of myFollowings) {
                for (const followingOfFollowedUser of following.following.followers) {
                    console.log(followingOfFollowedUser.followingId);
                    if (followingOfFollowedUser.followingId !== ((_e = ctx.user) === null || _e === void 0 ? void 0 : _e.id) && myFollowings.findIndex(e => e.followingId === followingOfFollowedUser.followingId) < 0) {
                        user.push(followingOfFollowedUser.following);
                    }
                }
            }
            return user;
        })
    }
};
exports.resolvers = { queries, extraResolvers, mutations };
