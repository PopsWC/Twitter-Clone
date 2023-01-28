/**
 *
 * This is an example router, you can delete this file and then update `../pages/api/trpc/[trpc].tsx`
 */
import { createTRPCRouter, publicProcedure } from '../trpc';
import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { prisma } from '../../db';

/**
 * Default selector for Post.
 * It's important to always explicitly say which fields you want to return in order to not leak extra information
 * @see https://github.com/prisma/prisma/issues/9353
 */

const defaultUserSelect = Prisma.validator<Prisma.UserSelect>()({
    id: true,
    name: true,
    image: true,
});


export const userRouter = createTRPCRouter({
    usernameById: publicProcedure
        .input(
            z.object({
                id: z.string(),
            }),
        )
        .query(async ({ input }) => {
            const { id } = input;
            const username = await prisma.user.findFirstOrThrow({
                where: { id },
                select: defaultUserSelect,
                
            });
            if (!username) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: `No post with name '${defaultUserSelect.id.toString()}'`,
                });
            }
            return username;
        }),
});
