import z from "zod";
import { HttpMethod } from "@prisma/client";

export const permissionSchema = z.object({
  id: z.number(),
  name: z.string(),
  desc: z.string().nullable(),
  path: z.string(),
  method: z.nativeEnum(HttpMethod),
  module: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

