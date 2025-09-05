import z from "zod";

export const roleSchema = z.object({
  id: z.number(),
  name: z.string(),
  desc: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
});