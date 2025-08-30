import { ZodError } from 'zod';
import { createZodValidationPipe } from 'nestjs-zod';
import { UnprocessableEntityException } from '@nestjs/common';

export const CustomZodValidationPipe: any = createZodValidationPipe({
  createValidationException: (error: ZodError) => {
    const err = {
      issues: error.issues.map((e) => ({
        path: e.path.join(', '),
        message: e.message,
      })),
    };
    return new UnprocessableEntityException(err);
  },
});
