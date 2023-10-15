"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.muatation = void 0;
// import {CreateTweetData} from './types'
exports.muatation = `#graphql

 createTweet(payload: CreateTweetData!): Tweet
 deleteTweet(payload: DeleteTweetData!): Boolean

`;
