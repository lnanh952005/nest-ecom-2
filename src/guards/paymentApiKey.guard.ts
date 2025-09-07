import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { EnvService } from 'src/modules/share/services/env.service';

@Injectable()
export class PaymentApiKeyGuard implements CanActivate {
  constructor(private envService: EnvService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const paymentApiKey = req.headers.authorization?.split(' ')[1];
    if (paymentApiKey != this.envService.PAYMENT_API_KEY) {
      throw new UnauthorizedException('invalid payment api key');
    }
    return true;
  }
}
