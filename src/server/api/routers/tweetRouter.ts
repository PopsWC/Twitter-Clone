import { z } from 'zod'
import { createTRPCRouter, publicProcedure, protectedProcedure, } from '../trpc'
import { Prisma } from '@prisma/client';


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
                tweet: z.string(),
                parentId: z.string().optional()
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
                    parentId : input.parentId ? input.parentId : null,
                    isParent: input.parentId ? true : false,
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
            tweedId: z.string().optional(),
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
            where: {
                parentId: input.tweedId ? input.tweedId : null
            },
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
    getTweet: publicProcedure
    .input(
        z.object({
            tweetId: z.string(),
        })
    )
    .query(async ({ ctx, input }) => {
        const { prisma } = ctx
        const tweet = await prisma.tweets.findUnique({
            where: {
                id: input.tweetId,
            },
            include: {
                likes: true,
                shares: true
            }
        })
        return tweet
    }),
    checkComment: protectedProcedure
    .input(
        z.object({
            tweetId: z.string()
        })
    )
    .query(async ({ ctx, input }) => {
        const { prisma } = ctx
        const commentData = {
            tweetId: input.tweetId,
            userId: ctx.session.user.id
        }
        const comment = await prisma.tweets.findFirst({
            where: {
                parentId: commentData.tweetId,
                userId: commentData.userId
            }
        })
        return comment
    }),
    getComments: publicProcedure
    .input(
        z.object({
            tweetId: z.string()
        })
    )
    .query(async ({ ctx, input }) => {
        const { prisma } = ctx
        const commentData = {
            tweetId: input.tweetId,
        }
        const comments = await prisma.tweets.findMany({
            where: {
                parentId: commentData.tweetId,
            },
        })
        return comments
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
        checkLike: protectedProcedure
        .input(
            z.object({
                tweetId: z.string()
            })
        )
        .query(async ({ ctx, input }) => {
            const { prisma } = ctx
            const likeData = {
                tweetId: input.tweetId,
                userId: ctx.session.user.id
            }
            const like = await prisma.likes.findUnique({
                where: {
                    userId_tweetId: {
                        userId: likeData.userId,
                        tweetId: likeData.tweetId
                    }
                }
            })
            return like
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
        checkShare: protectedProcedure
        .input(
            z.object({
                tweetId: z.string()
            })
        )
        .query(async ({ ctx, input }) => {
            const { prisma } = ctx
            const shareData = {
                tweetId: input.tweetId,
                userId: ctx.session.user.id
            }
            const like = await prisma.shares.findUnique({
                where: {
                    userId_tweetId: {
                        userId: shareData.userId,
                        tweetId: shareData.tweetId
                    }
                }
            })
            return like
        }),
})