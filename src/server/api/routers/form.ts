import { z } from "zod";
import * as trpc from "@trpc/server";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { FormSchema } from "@/server/schema/form.schema";

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
        napravlenie,
        otchet,
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
          napravlenie,
          otchet,
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

      const message =
        "Вы успешно зарегестрировались и отправили форму в Систему ИАЦ, ждите подтверждения от руководителей.";
      await fetch(
        `https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage?chat_id=${ctx.session.user.id}&text=${message}&parse_mode=HTML`
      );

      return {
        status: 201,
        message: "Form submitted successfully!",
        result: { name: result.name },
      };
    }),
});
