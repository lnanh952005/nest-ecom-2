import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Res<T> {
  data: T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Res<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Res<T>> {
    const req: Request = context.switchToHttp().getRequest();
    const res: Response = context.switchToHttp().getResponse();
    console.log(req.path + ' ' + req.method);
    return next.handle().pipe(
      map((data) => ({
        statusCode: res.statusCode,
        data,
      })),
    );
  }
}
