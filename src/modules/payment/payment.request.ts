import { createZodDto } from "nestjs-zod";
import z from "zod";

const webhookPaymentBodySchema = z.object({
  id: z.number(), // id giao dich tren sepay
  gateway: z.string(), // brand name cua ngan hang
  transactionDate: z.string(), // thoi gian xay ra giao dich phia ngan hang
  accountNumber: z.string().nullable(), // STK ngan hang
  code: z.string().nullable(), // ma code thanh toan (sepay tu nhan dien vao cau hinh)
  content: z.string().nullable(), // noi dung chuyen khoang
  transferType: z.enum(['in', 'out']), // in la tien vao, out la tien ra
  transferAmount: z.number(), // so tien giao dich
  accumulated: z.number(), // so du tai khoan
  subAccount: z.string().nullable(), // tk ngan hang phu
  referenceCode: z.string().nullable(), // ma tham chieu tin nhan sms
  description: z.string(), // noi dung tin nhan sms
});

export class WebhookPaymentDto extends createZodDto(webhookPaymentBodySchema){}