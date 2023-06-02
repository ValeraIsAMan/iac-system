import { z } from "zod";

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const taskSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: z.string(),
  label: z.string(),
  priority: z.string(),
});

export const userSchema = z.object({
  FIO: z.string(),
  telegramId: z.string(),
  phonenumber: z.string(),
  // startdate: z.date(),
  // enddate: z.date(),
  // napravlenie: z.string(),
  // otchet: z.string(),
  curator: z.string(),
  eduName: z.string(),
  specialty: z.string(),
  year: z.string(),
  apprenticeshipType: z.string(),

  confirmed: z.boolean(),
  signedNapravlenie: z.boolean(),
  signedOtchet: z.boolean(),
});

export type UserForm = z.infer<typeof userSchema>;
