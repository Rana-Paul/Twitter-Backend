import { Tweet } from "prisma/prisma-client"
import { prismaClient } from "../../client/db"
import { GraphqlContext } from "../../interfaces"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import UserService from "../../services/user"
import TweetService from "../../services/tweet"
import {CreateTweetPayload} from '../../services/tweet'


const s3Client = new S3Client({
    region: process.env.AWS_DEFAULT_REGION,
})

const queries = {
    getAllTweets: async() => {
        return await TweetService.getAllTweet();

    },

    getSignedURLForTweet: async(parent: any, {imageName, imageType}: {imageName: string, imageType: string, }, ctx: GraphqlContext) => {
        if(!ctx.user || !ctx.user.id) throw new Error("You must be logged in to create a tweet");
        const allowedImageTypes = ["image/png", "image/jpeg", "image/jpg", "image/png", "image/webp"];
        if(!allowedImageTypes.includes(imageType)) throw new Error("Invalid image type");
        const putObjectCommand = new PutObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET,
            ContentType: imageType,
            Key: `uploads/${ctx.user.id}/tweets/${imageName}-${Date.now()}`,
        });

        const signedURL = await getSignedUrl(s3Client, putObjectCommand,);
        return signedURL;
    }
}

const muatation  ={
    createTweet: async(parent: any, {payload}: {payload: CreateTweetPayload}, ctx: GraphqlContext) => {
        if(!ctx.user) throw new Error("You must be logged in to create a tweet")
       const tweet = await TweetService.createTweet({...payload, userId: ctx.user.id});
        return tweet;
    }
}

const extraResolvers = {
    Tweet: {
        author: async(parent: Tweet) => {
            return await UserService.getUserByID(parent.authorId)
        }
    }
}

export const resolvers = {muatation, extraResolvers, queries}