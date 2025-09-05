import z from 'zod';
import { createZodDto } from 'nestjs-zod';
import { roleSchema } from '@role/role.schema';
import { permissionSchema } from '@permission/permission.schema';

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
