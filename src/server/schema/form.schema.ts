import { z } from "zod";

export const FormSchema = z.object({
  FIO: z.string(),
  phonenumber: z.string(),
  startdate: z.date(),
  enddate: z.date(),
  napravlenie: z.string(),
  otchet: z.string(),
  // curator: z.string(),
  eduName: z.string(),
  specialty: z.string(),
  year: z.string(),
  apprenticeshipType: z.string(),
  // work: z.boolean(),
});

export const CuratorSchema = z.object({
  FIO: z.string(),
  telegramID: z.string(),
});

export type Form = z.infer<typeof FormSchema>;
export type Curator = z.infer<typeof CuratorSchema>;
