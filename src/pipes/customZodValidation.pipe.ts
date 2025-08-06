import { ZodError } from 'zod';
import { createZodValidationPipe, ZodSerializerDto } from 'nestjs-zod';
import { UnprocessableEntityException } from '@nestjs/common';

export const CustomZodValidationPipe = createZodValidationPipe({
  createValidationException: (error: ZodError) => {
    const err = {
      "issues": error.issues.map(e => ({
        path: e.path.join(", "),
        message: e.message
      }) )
    }
    return new UnprocessableEntityException(err);
  },
});
