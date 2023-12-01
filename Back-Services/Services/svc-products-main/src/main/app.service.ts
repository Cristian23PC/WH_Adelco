import { Injectable } from '@nestjs/common';
import { HealthCheckService, HttpHealthIndicator } from '@nestjs/terminus';

@Injectable()
export class AppService {
  constructor(private healthCheckService: HealthCheckService, private http: HttpHealthIndicator) {}

  live() {
    return this.healthCheckService.check([]);
  }

  ready() {
    return this.healthCheckService.check([() => this.http.pingCheck('commercetools', 'https://status.commercetools.com')]);
  }
}
