import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { OrderProducer } from '@order/order.producer';
import { OrderRepository } from '@order/order.repository';
import { PAYMENT_QUEUE_NAME } from '@share/consts/queue';
import { OrderController } from 'src/modules/order/order.controller';
import { OrderService } from 'src/modules/order/order.service';

@Module({
  controllers: [OrderController],
  providers: [OrderService, OrderProducer, OrderRepository],
  imports: [
    BullModule.registerQueue({
      name: PAYMENT_QUEUE_NAME,
    }),
  ],
})
export class OrderModule {}