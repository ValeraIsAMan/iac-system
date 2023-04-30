import { z } from "zod";
import * as trpc from "@trpc/server";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { FormSchema } from "@/server/schema/form.schema";
import { Telegraf } from "telegraf";
import { env } from "@/env.mjs";

export const formRouter = createTRPCRouter({
  createForm: protectedProcedure
    .input(FormSchema)
    .mutation(async ({ input, ctx }) => {
      const {
        FIO,
        phonenumber,
        startdate,
        enddate,
        eduName,
        specialty,
        year,
        apprenticeshipType,
      } = input;

      const name = ctx.session.user.name;

      const exists = await ctx.prisma.user.findFirst({
        where: { name },
      });

      if (exists) {
        throw new trpc.TRPCError({
          code: "CONFLICT",
          message: "User already exists.",
        });
      }

      const result = await ctx.prisma.user.create({
        data: {
          name,
          FIO,
          phonenumber,
          startdate,
          enddate,
          eduName,
          specialty,
          year,
          apprenticeshipType,
          image: ctx.session.user.image,
          telegramID: ctx.session.user.id,
        },
      });

      if (!result) {
        throw new trpc.TRPCError({
          code: "BAD_REQUEST",
          message: "Error creating form.",
        });
      }

      const bot = new Telegraf(env.BOT_TOKEN);
      bot.launch();
      bot.telegram.sendMessage(
        ctx.session.user.id,
        "Вы успешно зарегестрировались и отправили форму в Систему ИАЦ, ждите подтверждения от руководителей."
      );
      bot.stop();

      return {
        status: 201,
        message: "Form submitted successfully!",
        result: { name: result.name },
      };
    }),
});
