import { Injectable } from '@nestjs/common';
import { PaymentRepository } from 'src/modules/payment/payment.repository';
import { WebhookPaymentDto } from 'src/modules/payment/payment.request';

@Injectable()
export class PaymentService {
  constructor(private paymentRepository: PaymentRepository) {}

  async receiver(data: WebhookPaymentDto) {
    const payment = await this.paymentRepository.receiver(data);
  }
}
