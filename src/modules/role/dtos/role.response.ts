import z from 'zod';
import { createZodDto } from 'nestjs-zod';
import { permissionSchema, roleSchema } from '@share/schemas/auth.schema';

const roleDetailDto = roleSchema.extend({
  permissions: z.array(
    permissionSchema.omit({
      createdAt: true,
      updatedAt: true,
    }),
  ),
});

const roleListDto = z.array(
  roleDetailDto.omit({
    permissions: true,
  }),
);

export class RoleDetailDto extends createZodDto(roleDetailDto) {}
export class RoleListDto extends createZodDto(roleListDto) {}
