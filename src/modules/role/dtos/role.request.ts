import z from 'zod';
import { RoleEnum } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';

const createRoleDto = z.strictObject({
  name: z.nativeEnum(RoleEnum),
  desc: z.string(),
});

const updateRoleDto = createRoleDto.extend({
  permissionIds: z.array(z.number()),
});

export class CreateRoleDto extends createZodDto(createRoleDto) {}
export class UpdateRoleDto extends createZodDto(updateRoleDto) {}
