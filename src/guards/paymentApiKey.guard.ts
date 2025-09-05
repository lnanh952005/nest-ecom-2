import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { EnvService } from 'src/modules/share/services/env.service';

export class PaymentApiKeyGuard implements CanActivate {
  constructor(private envService: EnvService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    const paymentApiKey = req.headers['payment-api-key'];
    if (paymentApiKey != this.envService.PAYMENT_API_KEY) {
      throw new UnauthorizedException();
    }
    return true;
  }
}
