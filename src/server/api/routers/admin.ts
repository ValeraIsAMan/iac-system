import * as trpc from "@trpc/server";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

import { userSchema } from "@/components/table-data/schema";

export const adminRouter = createTRPCRouter({
  editUser: protectedProcedure
    .input(userSchema)
    .mutation(async ({ input, ctx }) => {
      const {
        telegramId,
        FIO,
        phonenumber,
        curator,
        eduName,
        specialty,
        year,
        apprenticeshipType,

        confirmed,
        signedNapravlenie,
        signedOtchet,
      } = input;

      if (
        telegramId == "" ||
        FIO == "" ||
        phonenumber == "" ||
        curator == "" ||
        eduName == "" ||
        confirmed == null ||
        specialty == "" ||
        year == "" ||
        apprenticeshipType == "" ||
        signedNapravlenie == null ||
        signedOtchet == null
      ) {
        throw new trpc.TRPCError({
          code: "BAD_REQUEST",
          message: "Запролните все поля",
        });
      }

      const exists = await ctx.prisma.user.findFirst({
        where: { telegramID: telegramId },
      });

      if (!exists) {
        throw new trpc.TRPCError({
          code: "CONFLICT",
          message: "User doesnt exists.",
        });
      }

      const result = await ctx.prisma.user.update({
        where: {
          telegramID: telegramId,
        },
        data: {
          FIO,
          phonenumber,
          curator,

          eduName,
          confirmed,
          specialty,
          year,
          apprenticeshipType,
          signedNapravlenie,
          signedOtchet,
        },
      });

      if (!result) {
        throw new trpc.TRPCError({
          code: "BAD_REQUEST",
          message: "Данные не сохранились.",
        });
      }

      return {
        status: 201,
        message: "Form submitted successfully!",
        result: { name: result.name },
      };
    }),
});
