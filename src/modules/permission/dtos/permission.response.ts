import z from 'zod';
import { paginationSchema, permissionSchema } from '@share/schemas/auth.schema';

export const permissionResDto = permissionSchema;

export const permissionListResDto = paginationSchema.extend({
  items: z.array(
    permissionResDto.omit({
      createdAt: true,
      updatedAt: true,
    }),
  ),
});
