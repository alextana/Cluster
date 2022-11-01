import { router, protectedProcedure } from "../trpc";
import { z } from "zod";

export const teamRouter = router({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.team.findMany();
  }),
  getById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { id } = input;
      let team = null;

      team = await ctx.prisma.team.findUnique({
        where: {
          id: id,
        },
      });

      // TODO - pair teams to tasks
      return team;
    }),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        created_at: z.date().nullish(),
        organisation_id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { name, created_at, organisation_id } = input;
      const team = await ctx.prisma.team.create({
        data: {
          name: name,
          created_at: created_at,
          organisationId: organisation_id,
        },
      });

      return team;
    }),
  createFirst: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        created_at: z.date().nullish(),
        organisation_id: z.string(),
        user_id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { name, created_at, organisation_id, user_id } = input;
      const team = await ctx.prisma.team.create({
        data: {
          name: name,
          created_at: created_at,
          organisationId: organisation_id,
        },
      });

      const user = await ctx.prisma.user.update({
        where: {
          id: user_id,
        },
        data: {
          first_login: false,
        },
      });

      return { team, user };
    }),
});
