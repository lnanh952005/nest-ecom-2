import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ZodSchema } from 'zod';
import { Request } from 'express';
import { map } from 'rxjs/operators';

@Injectable()
export class ValidationInterceptor implements NestInterceptor {
  private validate?: ZodSchema;
  private serialize?: ZodSchema;
  private type?: string;
  constructor({
    validate,
    serialize,
    type = 'body',
  }: {
    validate?: ZodSchema;
    serialize?: ZodSchema;
    type?: 'body' | 'params' | 'query';
  }) {
    this.validate = validate;
    this.serialize = serialize;
    this.type = type;
  }
  intercept(context: ExecutionContext, next: CallHandler) {
    const req = context.switchToHttp().getRequest<Request>();
    if (this.validate) {
      if (this.type == 'body') {
        req.body = this.validate.parse(req.body);
      }
    }
    return next.handle().pipe(
      map((data) => {
        if (this.serialize) {
          return this.serialize?.parse(data);
        }
        return data;
      }),
    );
  }
}
