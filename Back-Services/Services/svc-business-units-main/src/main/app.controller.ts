import { Get, Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { HealthCheck } from '@nestjs/terminus';

@Controller('health')
@ApiTags('health')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('live')
  @HealthCheck()
  live() {
    return this.appService.live();
  }

  @Get('ready')
  @HealthCheck()
  ready() {
    return this.appService.ready();
  }
}
