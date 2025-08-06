import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { ShareModule } from './modules/share/share.module';

import { AuthGuard } from './guards/auth.guard';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { UserModule } from './modules/user/user.module';
import { CustomZodValidationPipe } from './pipes/customZodValidation.pipe';
import { HttpExceptionFilter } from './filters/httpException.filter';
import { LanguageModule } from './modules/language/language.module';
import { ZodErrorFilter } from './filters/zodError.filter';
import { PermissionModule } from 'src/modules/permission/permission.module';
import { RoleModule } from 'src/modules/role/role.module';
import { ProfileModule } from 'src/modules/profile/profile.module';

@Module({
  imports: [
    ShareModule,
    AuthModule,
    UserModule,
    LanguageModule,
    RoleModule,
    ProfileModule,
    PermissionModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_PIPE,
      useClass: CustomZodValidationPipe,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: ZodErrorFilter,
    },
  ],
})
export class AppModule {}
