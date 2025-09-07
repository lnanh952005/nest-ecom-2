import path from 'path';
import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { AcceptLanguageResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';

import { AppService } from './app.service';
import { AuthGuard } from './guards/auth.guard';
import { AppController } from './app.controller';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { RoleModule } from 'src/modules/role/role.module';
import { ShareModule } from './modules/share/share.module';
import { MediaModule } from 'src/modules/media/media.module';
import { BrandModule } from 'src/modules/brand/brand.module';
import { ProfileModule } from 'src/modules/profile/profile.module';
import { ProductModule } from 'src/modules/product/product.module';
import { LanguageModule } from './modules/language/language.module';
import { HttpExceptionFilter } from './filters/httpException.filter';
import { CategoryModule } from 'src/modules/category/category.module';
import { PermissionModule } from 'src/modules/permission/permission.module';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { CartModule } from 'src/modules/cart/cart.module';
import { ZodSerializerInterceptor } from 'nestjs-zod';
import { CustomZodValidationPipe } from 'src/pipes/customZodValidation.pipe';
import { OrderModule } from 'src/modules/order/order.module';
import { SerializationExceptionFilter } from 'src/filters/serializationException.filter';
import { PaymentModule } from 'src/modules/payment/payment.module';
import { EnvService } from '@share/services/env.service';

@Module({
  imports: [
    ShareModule,
    AuthModule,
    UserModule,
    LanguageModule,
    RoleModule,
    ProfileModule,
    MediaModule,
    BrandModule,
    CategoryModule,
    PermissionModule,
    ProfileModule,
    ProductModule,
    CartModule,
    OrderModule,
    PaymentModule,
    BullModule.forRootAsync({
      inject: [EnvService],
      useFactory:(env:EnvService) => ({
        connection: {
          url: env.REDIS_URL,
        }
      })
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'all',
      loaderOptions: {
        path: path.resolve('src/i18n'),
        watch: true,
      },
      resolvers: [
        AcceptLanguageResolver,
        { use: QueryResolver, options: ['lang'] },
      ],
      typesOutputPath: path.resolve('src/generated/i18n.generated.ts'),
    }),
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
      provide: APP_INTERCEPTOR,
      useClass: ZodSerializerInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: SerializationExceptionFilter,
    },
  ],
})
export class AppModule {}
