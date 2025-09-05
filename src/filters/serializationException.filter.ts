import { Response } from 'express';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { ZodSerializationException } from 'nestjs-zod';

@Catch(ZodSerializationException)
export class SerializationExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const zodError = exception.getZodError();
    return response.status(400).json(zodError);
  }
}
