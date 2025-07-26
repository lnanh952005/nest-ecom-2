import { Response } from 'express';
import { ZodValidationException } from 'nestjs-zod';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';

@Catch(ZodValidationException)
export class ZodValidationExceptionFilter implements ExceptionFilter {
  catch(exception: ZodValidationException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const zodError = exception.getZodError();
    const errors = zodError.issues.map((e) => ({
      path: e.path.join(', '),
      message: e.message,
    }));
    return response.status(status).json({ errors });
  }
}
