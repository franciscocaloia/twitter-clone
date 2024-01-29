import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const userRouter = createTRPCRouter({
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        select: {
          id: true,
          name: true,
          image: true,
          _count: {
            select: {
              followers: true,
              following: true,
              tweets: true,
            },
          },
          followers:
            ctx.session?.user.id == null
              ? undefined
              : { where: { id: ctx.session?.user.id } },
        },
        where: {
          id: input.id,
        },
      });
      console.log(ctx.session?.user);

      if (user == null) return null;
      return {
        id: user.id,
        name: user.name,
        image: user.image,
        followers: user._count.followers,
        following: user._count.following,
        tweets: user._count.tweets,
        isFollowing: ctx.session?.user ? user.followers.length > 0 : false,
      };
    }),
  followUser: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existingFollowing = await ctx.db.user.findUnique({
        where: {
          id: input.id,
          followers: {
            some: {
              id: ctx.session.user.id,
            },
          },
        },
      });
      const response = {
        followed: false,
      };

      if (existingFollowing == null) {
        await ctx.db.user.update({
          where: { id: input.id },
          data: {
            followers: {
              connect: {
                id: ctx.session.user.id,
              },
            },
          },
        });
        response.followed = true;
      } else {
        await ctx.db.user.update({
          where: { id: input.id },
          data: {
            followers: {
              disconnect: {
                id: ctx.session.user.id,
              },
            },
          },
        });
        response.followed = false;
      }
      return response;
    }),
});
