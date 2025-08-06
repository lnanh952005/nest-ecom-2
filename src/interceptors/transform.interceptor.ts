import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { Request, Response } from 'express';
import { MESSAGE_METADATA_KEY } from 'src/decorators/message.decorator';

export interface Res<T> {
  data: T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Res<T>> {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<Res<T>> {
    const message = this.reflector.get(
      MESSAGE_METADATA_KEY,
      context.getHandler(),
    );
    const req: Request = context.switchToHttp().getRequest();
    const res: Response = context.switchToHttp().getResponse();
    console.log(req.path + ' ' + req.method);
    return next.handle().pipe(
      map((data) => ({
        message,
        statusCode: res.statusCode,
        data,
      })),
    );
  }
}
