import z from 'zod';
import { permissionSchema } from '@share/schemas/auth.schema';

export const createPermissionDto = permissionSchema
  .pick({
    name: true,
    path: true,
    method: true,
    module: true,
  })
  .extend({
    desc: z.string().optional(),
  })
  .strict();

export const updatePermissionDto = createPermissionDto;
