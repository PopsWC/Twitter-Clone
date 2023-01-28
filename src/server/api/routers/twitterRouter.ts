/**
 *
 * This is an example router, you can delete this file and then update `../pages/api/trpc/[trpc].tsx`
 */
import { createTRPCRouter, publicProcedure } from '../trpc';
import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { date, z } from 'zod';
import { prisma } from '../../db';

/**
 * Default selector for Post.
 * It's important to always explicitly say which fields you want to return in order to not leak extra information
 * @see https://github.com/prisma/prisma/issues/9353
 */

const defaultPostSelect = Prisma.validator<Prisma.TweetsSelect>()({
  id: true,
  userId: true,
  tweet: true,
  userName: true,
  createdAt: true,
  updatedAt: true,
});


const defaultLikesSelector = Prisma.validator<Prisma.LikesSelect>()({
  id: true,
  tweetId: true,
  userId: true,
  liked: true,
});

const defaultShareSelector = Prisma.validator<Prisma.SharesSelect>()({
  id: true,
  tweetId: true,
  userId: true,
  shared: true,
});


export const tweetRouter = createTRPCRouter({
  list: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(),
      }),
    )
    .query(async ({ input }) => {
      /**
       * For pagination docs you can have a look here
       * @see https://trpc.io/docs/useInfiniteQuery
       * @see https://www.prisma.io/docs/concepts/components/prisma-client/pagination
       */

      const limit = input.limit ?? 50;
      const { cursor } = input;

      const items = await prisma.tweets.findMany({
        select: defaultPostSelect,
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
  byUser: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(),
      }),
    )
    .query(async ({ input }) => {
      /**
       * For pagination docs you can have a look here
       * @see https://trpc.io/docs/useInfiniteQuery
       * @see https://www.prisma.io/docs/concepts/components/prisma-client/pagination
       */

      const limit = input.limit ?? 50;
      const { cursor } = input;
      const items = await prisma.tweets.findMany({
        select: defaultPostSelect,
        // get an extra item at the end which we'll use as next cursor
        take: limit + 1,
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
  byId: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const { id } = input;
      const post = await prisma.tweets.findUnique({
        where: { id },
        select: defaultPostSelect,
      });
      if (!post) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `No post with id '${id}'`,

        });
      }
      return post;
    }),
  likeTweet: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        tweetId: z.string(),
      }),
    )
    .mutation
    (async ({ input }) => {
      const { userId, tweetId } = input;
      try {
        const checkLike = await prisma.likes.findMany({
          where: { userId, tweetId },
          select: {
            id: true,
            liked: true,
          }
        });
        if (checkLike[0]?.liked === true) {
          const like = await prisma.likes.update({
            where: { id: checkLike[0].id },
            data: { liked: false },
            select : defaultLikesSelector
          });
          return like;
        }
        else if (checkLike[0]?.liked === false) {
          const like = await prisma.likes.update({
            where: { id: checkLike[0].id },
            data: { liked: true },
            select : defaultLikesSelector
          });
          return like;
        }
        else {
          const like = await prisma.likes.create({
            data: { userId, tweetId, liked: true },
            select : defaultLikesSelector
          });
          return like;
        }
      } catch (error) {
        console.log(error);
      }
    }),
  checkLike: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        tweetId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const { userId, tweetId } = input;
      try {
        const checkLike = await prisma.likes.findMany({
          where: { userId, tweetId },
          select: {
            id: true,
            liked: true,
          }
        });
        if (checkLike[0]?.liked === true) {
          return true;
        }
        else if (checkLike[0]?.liked === false) {
          return false;
        }
        else {
          return false;
        }
      } catch (error) {
        console.log(error);
      }
    }),
  getLikes: publicProcedure
    .input(
      z.object({
        tweetId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const { tweetId } = input;
      try {
        const likes = await prisma.likes.findMany({
          where: { tweetId, liked: true }
        })
        return likes.length;
      } catch (error) {
        return 0;
      }
    }),
    
  
    shareTweet: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        tweetId: z.string(),
      }),
    )
    .mutation
    (async ({ input }) => {
      const { userId, tweetId } = input;
      try {
        const checkShare = await prisma.shares.findMany({
          where: { userId, tweetId },
          select: {
            id: true,
            shared: true,
          }
        });
        if (checkShare[0]?.shared === true) {
          const share = await prisma.shares.update({
            where: { id: checkShare[0].id },
            data: { shared: false },
            select : defaultShareSelector
          });
          return share;
        }
        else if (checkShare[0]?.shared === false) {
          const share = await prisma.shares.update({
            where: { id: checkShare[0].id },
            data: { shared: true },
            select : defaultShareSelector
          });
          return share;
        }
        else {
          const shared = await prisma.shares.create({
            data: { userId, tweetId, shared: true },
            select : defaultShareSelector
          });
          return shared;
        }
      } catch (error) {
        console.log(error);
      }
    }),
  checkShare: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        tweetId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const { userId, tweetId } = input;
      try {
        const checkShare = await prisma.shares.findMany({
          where: { userId, tweetId },
          select: {
            id: true,
            shared: true,
          }
        });
        if (checkShare[0]?.shared === true) {
          return true;
        }
        else if (checkShare[0]?.shared === false) {
          return false;
        }
        else {
          return false;
        }
      } catch (error) {
        console.log(error);
      }
    }),
  getShares: publicProcedure
    .input(
      z.object({
        tweetId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const { tweetId } = input;
      try {
        const shares = await prisma.shares.findMany({
          where: { tweetId, shared: true }
        })
        return shares.length;
      } catch (error) {
        return 0;
      }
    }),

  add: publicProcedure
    .input(
      z.object({
        id: z.string().uuid().optional(),
        tweet: z.string().min(1),
        userId: z.string().min(1),
        userName: z.string().min(1),

      }),
    )
    .mutation(async ({ input }) => {
      const post = await prisma.tweets.create({
        data: input,
        select: defaultPostSelect,
      });
      return post;
    }),
});
