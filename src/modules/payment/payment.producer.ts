import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import {
    PAYMENT_QUEUE_NAME
} from '@share/consts/queue';

@Injectable()
export class PaymentProducer {
  constructor(@InjectQueue(PAYMENT_QUEUE_NAME) private paymentQueue: Queue) {}

  removeJob(paymentId: number) {
    return this.paymentQueue.remove(paymentId.toString());
  }
}
