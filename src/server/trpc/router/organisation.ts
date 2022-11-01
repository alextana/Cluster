import { router, protectedProcedure } from "../trpc";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

export const organisationRouter = router({
  getAll: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const orgs = await ctx.prisma.usersOnOrganisations.findMany({
      where: {
        userId: input,
      },
    });

    if (!orgs) {
      return null;
    }

    const orgsIds = orgs.map((f) => f.organisationId);

    return await ctx.prisma.organisation.findMany({
      where: {
        id: { in: orgsIds },
      },
    });
  }),
  getById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { id } = input;
      let organisation = null;

      organisation = await ctx.prisma.organisation.findUnique({
        where: {
          id: id,
        },
      });

      // TODO - pair organisations to tasks
      return organisation;
    }),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        created_at: z.date().nullish(),
        user_id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { name, created_at, user_id } = input;
      const currId = uuidv4();
      const organisation = await ctx.prisma.organisation.create({
        data: {
          id: currId,
          name: name,
          created_at: created_at,
        },
      });

      const usersOnOrganisation = await ctx.prisma.usersOnOrganisations.create({
        data: {
          userId: user_id,
          organisationId: currId,
        },
      });

      return { organisation, usersOnOrganisation };
    }),
});
