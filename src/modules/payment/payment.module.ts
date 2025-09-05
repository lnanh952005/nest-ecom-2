import { Module } from '@nestjs/common';
import { PaymentController } from 'src/modules/payment/payment.controller';
import { PaymentRepository } from 'src/modules/payment/payment.repository';
import { PaymentService } from 'src/modules/payment/payment.service';

@Module({
  controllers: [PaymentController],
  providers: [PaymentService, PaymentRepository],
})
export class PaymentModule {}
