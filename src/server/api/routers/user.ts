import { z } from "zod";
import * as trpc from "@trpc/server";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
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
  getAllCurators: protectedProcedure.query(async ({ ctx }) => {
    const exists = await ctx.prisma.curator.findMany();

    if (!exists) {
      throw new trpc.TRPCError({
        code: "CONFLICT",
        message: "Users doesnt exists.",
      });
    }

    return exists;
  }),
  deleteStudent: protectedProcedure
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

      const result = await ctx.prisma.user.delete({
        where: { telegramID: id },
      });

      const second = 1000;
      setTimeout(
        (name: string, token: string, id: string) => {
          const message = `Добрый день ${name}, ваша заявка в ИАЦ была отвержена, вероятно надо обновить и заполнить данные опять.`;

          fetch(
            `https://api.telegram.org/bot${token}/sendMessage?chat_id=${id}&text=${message}&parse_mode=HTML`
          );
        },
        second,
        exists.FIO,
        env.BOT_TOKEN,
        id
      );

      return {
        status: 201,
        message: "Student deleted successfully!",
      };
    }),
  confirmStudent: protectedProcedure
    .input(z.object({ id: z.string(), curator: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { id, curator } = input; //telegram id

      if (curator === "") {
        throw new trpc.TRPCError({
          code: "BAD_REQUEST",
          message: "Curator isnt selected",
        });
      }

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

      const message = `Вашу заявку на прохождение практики подтвердили! Начало практики: ${result?.startdate?.toDateString()} в 9:00, ваш куратор будет ${curator}.В день практики вам отправят ссылку на группу в телеграм!`;

      await fetch(
        `https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage?chat_id=${id}&text=${message}&parse_mode=HTML`
      );

      return {
        status: 201,
        message: "Form submitted successfully!",
        result: { name: result.name },
      };
    }),
  confirmCurator: protectedProcedure
    .input(z.object({ id: z.string(), curator: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { id, curator } = input; //telegram id

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
          curator,
        },
      });

      if (!result) {
        throw new trpc.TRPCError({
          code: "PARSE_ERROR",
          message: "Telegram ID doesn't exists.",
        });
      }

      return {
        status: 201,
        message: "Curator changed successfully!",
      };
    }),
  deleteCurator: protectedProcedure
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
          curator: "",
        },
      });

      if (!result) {
        throw new trpc.TRPCError({
          code: "PARSE_ERROR",
          message: "Telegram ID doesn't exists.",
        });
      }

      return {
        status: 201,
        message: "Curator deleted successfully!",
      };
    }),
  confirmSigning: protectedProcedure
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
          signed: true,
        },
      });

      if (!result) {
        throw new trpc.TRPCError({
          code: "PARSE_ERROR",
          message: "Telegram ID doesn't exists.",
        });
      }

      const message = `Ваши документы готов к выдаче`;

      await fetch(
        `https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage?chat_id=${id}&text=${message}&parse_mode=HTML`
      );

      return {
        status: 201,
        message: "Signed documents successfully!",
      };
    }),
  createCurator: protectedProcedure
    .input(z.object({ id: z.string(), FIO: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { id, FIO } = input; //telegram id

      const exists = await ctx.prisma.curator.findFirst({
        where: { telegramID: id },
      });

      if (exists) {
        throw new trpc.TRPCError({
          code: "BAD_REQUEST",
          message: "Curator already exists.",
        });
      }

      const result = await ctx.prisma.curator.create({
        data: {
          telegramID: id,
          FIO: FIO,
        },
      });

      if (!result) {
        throw new trpc.TRPCError({
          code: "PARSE_ERROR",
          message: "Telegram ID doesn't exists.",
        });
      }

      return {
        status: 201,
        message: "Created curator successfully!",
      };
    }),
  deleteCurators: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { id } = input; //telegram id

      const exists = await ctx.prisma.curator.findFirst({
        where: { telegramID: id },
      });

      if (!exists) {
        throw new trpc.TRPCError({
          code: "BAD_REQUEST",
          message: "Curator doesnt exists.",
        });
      }

      const result = await ctx.prisma.curator.delete({
        where: {
          telegramID: id,
        },
      });

      if (!result) {
        throw new trpc.TRPCError({
          code: "PARSE_ERROR",
          message: "Telegram ID doesn't exists.",
        });
      }

      return {
        status: 201,
        message: "Deleted curator successfully!",
      };
    }),
});
