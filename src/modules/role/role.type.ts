import z from 'zod';
import {
  createRoleDto,
  updateRoleDto,
} from 'src/modules/role/dtos/role.request';

export type CreateRoleDtoType = z.infer<typeof createRoleDto>;
export type UpdateRoleDtoType = z.infer<typeof updateRoleDto>;
