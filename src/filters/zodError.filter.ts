import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { ZodError } from 'zod';
import { Response } from 'express';

@Catch(ZodError)
export class ZodErrorFilter implements ExceptionFilter {
  catch(exception: ZodError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    return response.status(422).json({
      statusCode: 422,
      errors: exception.issues.map((e) => ({
        ...e,
        path: e.path.join(', '),
      })),
    });
  }
}
