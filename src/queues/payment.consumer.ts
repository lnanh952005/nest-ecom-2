import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import {
  CANCEL_PAYMENT_JOB_NAME,
  PAYMENT_QUEUE_NAME,
} from '@share/consts/queue';
import { PaymentRepository } from 'src/modules/payment/payment.repository';

@Processor(PAYMENT_QUEUE_NAME)
export class PaymentConsumer extends WorkerHost {
  constructor(private paymentRepository: PaymentRepository) {
    super();
  }

  async process(job: Job<{ paymentId: number }>, token?: string): Promise<any> {
    switch (job.name) {
      case CANCEL_PAYMENT_JOB_NAME: {
        const paymentId = job.data.paymentId;
        await this.paymentRepository.cancelPaymentAndOrder(paymentId);
      }
    }
  }
}
