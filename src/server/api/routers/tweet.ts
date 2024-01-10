import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const tweetRouter = createTRPCRouter({
  infiniteFeed: publicProcedure
    .input(
      z.object({
        limit: z.number().optional(),
        cursor: z.object({ id: z.string(), createdAt: z.date() }).optional(),
      }),
    )
    .query(async ({ ctx, input: { limit = 10, cursor } }) => {
      const currentUserId = ctx.session?.user.id;
      const data = await ctx.db.tweet.findMany({
        take: limit ?? 10,
        cursor: cursor ? { createdAt_id: cursor } : undefined,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          text: true,
          createdAt: true,
          _count: {
            select: {
              likes: true,
            },
          },
          likes: currentUserId ? { where: { userId: currentUserId } } : false,
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      });
      let nextCursor: typeof cursor | undefined;

      if (data.length > 0) {
        const lastTweet = data.pop();
        if (lastTweet) {
          nextCursor = {
            id: lastTweet.id,
            createdAt: lastTweet.createdAt,
          };
        }
      }
      return {
        tweets: data.map((tweet) => {
          return {
            id: tweet.id,
            text: tweet.text,
            createdAt: tweet.createdAt,
            likeCount: tweet._count.likes,
            likedByMe: tweet.likes?.length > 0,
            user: tweet.user,
          };
        }),
        hasMore: data.length > limit,
        nextCursor,
      };
    }),
  create: protectedProcedure
    .input(z.object({ text: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.tweet.create({
        data: {
          text: input.text,
          userId: ctx.session.user.id,
        },
      });
    }),
});
