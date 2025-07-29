import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { EnvService } from 'src/modules/share/services/env.service';

export class ApiKeyGuard implements CanActivate {
  constructor(private envService: EnvService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    const xApiKey = req.headers['x-api-key'];
    if (xApiKey != this.envService.X_API_KEY) {
      throw new UnauthorizedException();
    }
    return true;
  }
}
