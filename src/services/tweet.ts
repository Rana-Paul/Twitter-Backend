import { prismaClient } from "../client/db"

export interface CreateTweetPayload {
    content: string
    imageURL?: string
    userId: string
    
}

class TweetService {
    public static createTweet(data: CreateTweetPayload) {

        return prismaClient.tweet.create({
            data: {
                content: data.content,
                imageURL: data.imageURL,
                authorId: data.userId
            }
        })        
    }

    public static getAllTweet() {
        return prismaClient.tweet.findMany({orderBy: {createdAt: "desc"}})
    }
}

export default TweetService