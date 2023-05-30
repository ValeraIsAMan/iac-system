import * as trpc from "@trpc/server";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { FormSchema, PraktSchema } from "@/server/schema/form.schema";

import { env } from "@/env.mjs";
import { EduSchema } from "@/server/schema/form.schema";

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
        specialty,
        year,
        apprenticeshipType,
      } = input;

      if (
        FIO == "" ||
        phonenumber == "" ||
        startdate == null ||
        enddate == null ||
        eduName == "" ||
        napravlenie == "" ||
        specialty == "" ||
        year == "" ||
        apprenticeshipType == ""
      ) {
        throw new trpc.TRPCError({
          code: "BAD_REQUEST",
          message: "Запролните все поля",
        });
      }

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
  getEduNames: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.eduName.findMany();
  }),
  getApreticeshipNames: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.apprenticeshipType.findMany();
  }),
  createEduFac: protectedProcedure
    .input(EduSchema)
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.prisma.eduName.create({
        data: {
          name: input.name,
        },
      });

      if (!result) {
        throw new trpc.TRPCError({
          code: "BAD_REQUEST",
          message: "Error creating educational facility.",
        });
      }

      return result;
    }),
  deleteEduFac: protectedProcedure
    .input(EduSchema)
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.prisma.eduName.delete({
        where: {
          name: input.name,
        },
      });

      if (!result) {
        throw new trpc.TRPCError({
          code: "BAD_REQUEST",
          message: "Error deleting educational facility.",
        });
      }

      return result;
    }),

  createPraktType: protectedProcedure
    .input(PraktSchema)
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.prisma.apprenticeshipType.create({
        data: {
          name: input.name,
        },
      });

      if (!result) {
        throw new trpc.TRPCError({
          code: "BAD_REQUEST",
          message: "Error creating praktical type.",
        });
      }

      return result;
    }),
  deletePraktType: protectedProcedure
    .input(PraktSchema)
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.prisma.apprenticeshipType.delete({
        where: {
          name: input.name,
        },
      });

      if (!result) {
        throw new trpc.TRPCError({
          code: "BAD_REQUEST",
          message: "Error deleting praktical type.",
        });
      }

      return result;
    }),
});
