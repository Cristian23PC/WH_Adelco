import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { HealthCheckService, HttpHealthIndicator } from '@nestjs/terminus';

@Injectable()
export class AppService implements OnApplicationShutdown {
  constructor(private healthCheckService: HealthCheckService, private http: HttpHealthIndicator) {}

  onApplicationShutdown(signal?: string) {}

  live() {
    return this.healthCheckService.check([]);
  }

  ready() {
    return this.healthCheckService.check([() => this.http.pingCheck('commercetools', 'https://status.commercetools.com')]);
  }
}
