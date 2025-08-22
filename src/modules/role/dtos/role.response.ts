import { permissionSchema, roleSchema } from '@share/schemas/auth.schema';
import z from 'zod';

export const roleResDto = roleSchema.extend({
  permissions: z.array(
    permissionSchema.omit({
      createdAt: true,
      updatedAt: true,
    }),
  ),
});

export const roleListResDto = z.array(
  roleResDto.omit({
    permissions: true,
  }),
);
