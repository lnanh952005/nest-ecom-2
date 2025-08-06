import z from 'zod';
import { createPermissionDto } from 'src/modules/permission/dtos/permission.request';
import { updateLanguageDto } from 'src/modules/language/dtos/language.request';

export type CreatePermissionDtoType = z.infer<typeof createPermissionDto>;
export type UpdatePermissionDtoType = z.infer<typeof updateLanguageDto>;
