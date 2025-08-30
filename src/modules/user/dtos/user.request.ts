import z from 'zod';
import { createZodDto } from 'nestjs-zod';
import { UserStatus } from '@prisma/client';

 const createUserDto = z.strictObject({
  email: z.string().email(),
  password: z.string().min(6).max(30),
  name: z.string(),
  avatar: z.string().nullable(),
  phoneNumber: z.string().nullable(),
  status: z.nativeEnum(UserStatus),
  roleId: z.number(),
});

 const updateUserDto = createUserDto;

 export class CreateUserDto extends createZodDto(createUserDto){}
 export class UpdateUserDto extends createZodDto(updateUserDto){}