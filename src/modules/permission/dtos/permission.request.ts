import z from 'zod';
import { createZodDto } from 'nestjs-zod';

import { permissionSchema } from '@share/schemas/auth.schema';

const createPermissionDto = permissionSchema
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

const updatePermissionDto = createPermissionDto;

export class CreatePermissionDto extends createZodDto(createPermissionDto) {}
export class UpdatePermissionDto extends createZodDto(updatePermissionDto) {}
