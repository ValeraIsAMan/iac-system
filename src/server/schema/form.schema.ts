import { z } from "zod";

export const FormSchema = z.object({
  FIO: z.string(),
  phonenumber: z.number(),
  startdate: z.string(),
  enddate: z.string(),
  napravlenie: z.boolean(),
  otchet: z.boolean(),
  curator: z.string(),
  eduName: z.string(),
  specialty: z.string(),
  year: z.number(),
  apprenticeshipType: z.string(),
  work: z.boolean(),
});

export type Form = z.infer<typeof FormSchema>;
