import { Processor, WorkerHost } from '@nestjs/bullmq';
import {
  CANCEL_PAYMENT_JOB_NAME,
  PAYMENT_QUEUE_NAME,
} from '@share/consts/queue';
import { Job } from 'bullmq';

@Processor(PAYMENT_QUEUE_NAME)
export class PaymentConsumer extends WorkerHost {
  async process(job: Job, token?: string): Promise<any> {
    switch (job.name) {
      case CANCEL_PAYMENT_JOB_NAME: {
        const paymentId = job.data.paymentId;
      }
    }
  }
}
