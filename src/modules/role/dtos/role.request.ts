import z from 'zod';
import { RoleEnum } from '@prisma/client';

export const createRoleDto = z.strictObject({
  name: z.nativeEnum(RoleEnum),
  desc: z.string(),
});

export const updateRoleDto = createRoleDto.extend({
  permissionIds: z.array(z.number()),
});
