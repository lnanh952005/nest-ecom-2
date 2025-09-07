import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { PAYMENT_QUEUE_NAME } from '@share/consts/queue';
import { PaymentController } from 'src/modules/payment/payment.controller';
import { PaymentProducer } from 'src/modules/payment/payment.producer';
import { PaymentRepository } from 'src/modules/payment/payment.repository';
import { PaymentService } from 'src/modules/payment/payment.service';

@Module({
  controllers: [PaymentController],
  providers: [PaymentService, PaymentRepository, PaymentProducer],
  imports: [
    BullModule.registerQueue({
      name: PAYMENT_QUEUE_NAME,
    }),
  ],
})
export class PaymentModule {}
