import { Queue } from 'bullmq';
import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import {
  CANCEL_PAYMENT_JOB_NAME,
  PAYMENT_QUEUE_NAME,
} from '@share/consts/queue';

@Injectable()
export class OrderProducer {
  constructor(@InjectQueue(PAYMENT_QUEUE_NAME) private paymentQueue: Queue) {}

  async addCancelPaymentJob(paymentId: number) {
    return await this.paymentQueue.add(
      CANCEL_PAYMENT_JOB_NAME,
      {
        paymentId,
      },
      {
        delay: 10 * 1000,
        jobId: paymentId.toString(),
        removeOnComplete: true,
        removeOnFail: true,
      },
    );
  }
}
