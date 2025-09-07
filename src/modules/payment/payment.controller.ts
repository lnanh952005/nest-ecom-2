import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { Message } from 'src/decorators/message.decorator';
import { Public } from 'src/decorators/public.decorator';
import { PaymentApiKeyGuard } from 'src/guards/paymentApiKey.guard';
import { WebhookPaymentDto } from 'src/modules/payment/payment.request';
import { PaymentService } from 'src/modules/payment/payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post('receiver')
  @Public()
  @UseGuards(PaymentApiKeyGuard)
  @Message("payment successfully")
  receiver(@Body() body: WebhookPaymentDto) {
    return this.paymentService.receiver(body);
  }
}
