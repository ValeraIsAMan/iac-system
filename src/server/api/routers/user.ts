import { z } from "zod";
import * as trpc from "@trpc/server";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { Telegraf } from "telegraf";
import { env } from "@/env.mjs";

export const userRouter = createTRPCRouter({
  getStatus: protectedProcedure.query(async ({ ctx }) => {
    const name = ctx.session.user.name;

    const exists = await ctx.prisma.user.findFirst({
      where: { name },
    });

    if (!exists) {
      throw new trpc.TRPCError({
        code: "CONFLICT",
        message: "User doesnt exists.",
      });
    }

    return exists;
  }),
  getAllUsers: protectedProcedure.query(async ({ ctx }) => {
    const exists = await ctx.prisma.user.findMany();

    if (!exists) {
      throw new trpc.TRPCError({
        code: "CONFLICT",
        message: "Users doesnt exists.",
      });
    }

    return exists;
  }),
  confirmStudent: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { id } = input; //telegram id

      const exists = await ctx.prisma.user.findFirst({
        where: { telegramID: id },
      });

      if (!exists) {
        throw new trpc.TRPCError({
          code: "BAD_REQUEST",
          message: "User doesn't exists.",
        });
      }

      const result = await ctx.prisma.user.update({
        where: {
          telegramID: id,
        },
        data: {
          confirmed: true,
        },
      });

      if (!result) {
        throw new trpc.TRPCError({
          code: "PARSE_ERROR",
          message: "Telegram ID doesn't exists.",
        });
      }

      const bot = new Telegraf(env.BOT_TOKEN);
      await bot.launch();
      await bot.telegram.sendMessage(
        id,
        `Вашу заявку на прохождение практики подтвердили! Начало практики: ${result.startdate?.toDateString()} в 9:00, ваш куратор будет ... В день практики вам отправят ссылку на группу в телеграм!`
      );
      bot.stop();

      return {
        status: 201,
        message: "Form submitted successfully!",
        result: { name: result.name },
      };
    }),
});
