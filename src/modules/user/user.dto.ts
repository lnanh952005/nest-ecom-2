import { createZodDto } from 'nestjs-zod';
import { createUserSchema, updateUserSchema } from './user.model';

export class CreateUser extends createZodDto(createUserSchema) {}
export class UpdateUser extends createZodDto(updateUserSchema) {}
