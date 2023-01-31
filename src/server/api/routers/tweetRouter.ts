import { z } from 'zod'
import { createTRPCRouter, publicProcedure, protectedProcedure, } from '../trpc'
import { Prisma } from '@prisma/client';
import { share } from '@trpc/server/observable';


const defaultTweetSelect = Prisma.validator<Prisma.TweetsSelect>()({
    id: true,
    userId: true,
    tweet: true,
    userName: true,
    createdAt: true,
    updatedAt: true,
  });

export const tweetRouter = createTRPCRouter({
    createTweet: protectedProcedure
        .input(
            z.object({
                tweet: z.string()
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { prisma } = ctx
            const tweetData = {
                userId: ctx.session.user.id,
                userName: ctx.session.user.name!,
                tweet: input.tweet
            }
            await prisma.tweets.create({
                data: {
                    tweet: tweetData.tweet,
                    userId: tweetData.userId,
                    userName: tweetData.userName
                },
            })
        }),
        list: publicProcedure
        .input(
          z.object({
            limit: z.number().min(1).max(100).nullish(),
            cursor: z.string().nullish(),
          }),
        )
        .query(async ({ ctx, input }) => {
          /**
           * For pagination docs you can have a look here
           * @see https://trpc.io/docs/useInfiniteQuery
           * @see https://www.prisma.io/docs/concepts/components/prisma-client/pagination
           */
    
          const limit = input.limit ?? 50;
          const { cursor } = input;
          const { prisma } = ctx
    
          const items = await prisma.tweets.findMany({
            select: defaultTweetSelect,
            // get an extra item at the end which we'll use as next cursor
            take: limit + 1,
            where: {},
            cursor: cursor
              ? {
                id: cursor,
              }
              : undefined,
            orderBy: {
              createdAt: 'desc',
            },
          });
          let nextCursor: typeof cursor | undefined = undefined;
          if (items.length > limit) {
            // Remove the last item and use it as next cursor
    
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const nextItem = items.pop()!;
            nextCursor = nextItem.id;
    
          }
          return {
            items: items.reverse(),
            nextCursor,
          };
        }),
    getTweetById: publicProcedure
    .input(
        z.object({
            tweetId: z.string()
        })
    )
    .query(async ({ ctx, input }) => {
        const { prisma } = ctx
        const tweet = await prisma.tweets.findUnique({
            where: {
                id: input.tweetId
            },
            include: {
                likes: true,
                shares: true
            }
        })
        return tweet
    }),
    like: protectedProcedure
        .input(
            z.object({
                tweetId: z.string()
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { prisma } = ctx
            const likeData = {
                tweetId: input.tweetId,
                userId: ctx.session.user.id
            }
            return await prisma.likes.create({
                data: {
                    user: {
                        connect: {
                            id: likeData.userId
                        }
                    },
                    tweet: {
                        connect: {
                            id: likeData.tweetId
                        }
                    }
                }
            })
        }),
    unlike: protectedProcedure
        .input(
            z.object({
                tweetId: z.string()
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { prisma } = ctx
            const userId = ctx.session.user.id
            const unlikeData = {
                tweetId: input.tweetId,
                userId: ctx.session.user.id
            }
            return await prisma.likes.delete({
                where: {
                    userId_tweetId: {
                        userId: unlikeData.userId,
                        tweetId: unlikeData.tweetId
                    }
                }
            })
        }),
        share: protectedProcedure
        .input(
            z.object({
                tweetId: z.string()
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { prisma } = ctx
            const shareData = {
                tweetId: input.tweetId,
                userId: ctx.session.user.id
            }
            return await prisma.shares.create({
                data: {
                    user: {
                        connect: {
                            id: shareData.userId
                        }
                    },
                    tweet: {
                        connect: {
                            id: shareData.tweetId
                        }
                    }
                }
            })
        }),
    unshare: protectedProcedure
        .input(
            z.object({
                tweetId: z.string()
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { prisma } = ctx
            const userId = ctx.session.user.id
            const unshareData = {
                tweetId: input.tweetId,
                userId: ctx.session.user.id
            }
            return await prisma.shares.delete({
                where: {
                    userId_tweetId: {
                        userId: unshareData.userId,
                        tweetId: unshareData.tweetId
                    }
                }
            })
        }),   
})