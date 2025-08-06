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
  constructor({
    validate,
    serialize,
  }: {
    validate?: ZodSchema;
    serialize?: ZodSchema;
  }) {
    this.validate = validate;
    this.serialize = serialize;
  }
  intercept(context: ExecutionContext, next: CallHandler) {
    const req = context.switchToHttp().getRequest<Request>();
    if (this.validate) {
      if (req.method === 'GET') {
        req.query = this.validate.parse(req.query);
      } else {
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
