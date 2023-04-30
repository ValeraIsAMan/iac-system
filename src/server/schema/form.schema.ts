import { z } from "zod";

export const FormSchema = z.object({
  FIO: z.string(),
  phonenumber: z.string(),
  startdate: z.date(),
  enddate: z.date(),
  // napravlenie: z.boolean(),
  // otchet: z.boolean(),
  // curator: z.string(),
  eduName: z.string(),
  specialty: z.string(),
  year: z.string(),
  apprenticeshipType: z.string(),
  // work: z.boolean(),
});

export type Form = z.infer<typeof FormSchema>;
