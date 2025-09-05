import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { PaymentApiKeyGuard } from 'src/guards/paymentApiKey.guard';
import { WebhookPaymentDto } from 'src/modules/payment/payment.request';
import { PaymentService } from 'src/modules/payment/payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post('receiver')
  @UseGuards(PaymentApiKeyGuard)
  receiver(@Body() body: WebhookPaymentDto) {
    return this.paymentService.receiver(body);
  }
}
