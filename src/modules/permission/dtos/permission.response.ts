import z from 'zod';
import { createZodDto } from 'nestjs-zod';
import { paginationSchema, permissionSchema } from '@share/schemas/auth.schema';

const permissionDetailDto = permissionSchema;

const permissionListDto = paginationSchema.extend({
  items: z.array(
    permissionDetailDto.omit({
      createdAt: true,
      updatedAt: true,
    }),
  ),
});

export class PermissionDetailDto extends createZodDto(permissionDetailDto) {}
export class PermissionListDto extends createZodDto(permissionListDto) {}
