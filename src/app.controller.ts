import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from 'src/decorators/public.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  getHello(@Param() id: string): string {
    return this.appService.getHello();
  }
}
