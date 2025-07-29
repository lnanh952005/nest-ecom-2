import { Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { ShareModule } from './modules/share/share.module';

import { AuthGuard } from './guards/auth.guard';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { UserModule } from './modules/user/user.module';
import { CustomZodValidationPipe } from './pipes/customZodValidation.pipe';

@Module({
  imports: [ShareModule, AuthModule,UserModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    },
    {
      provide: APP_PIPE,
      useClass: CustomZodValidationPipe,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    // {
    //   provide: APP_FILTER,
    //   useClass: HttpExceptionFilter,
    // },
  ],
})
export class AppModule {}
