import { ApiError } from '@/common/errors/api.error';
import { ConfigService } from '@nestjs/config';
import { ConvertedBusinessUnit } from './svc-business-units.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SvcBusinessUnitsService {
  constructor(private readonly configService: ConfigService) {}

  private baseUrl = this.configService.get('svc-business-units.baseUrl');

  async getById(businessUnitId: string, username: string, roles: string[]): Promise<ConvertedBusinessUnit> {
    const response = await fetch(`${this.baseUrl}/business-unit/${businessUnitId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': username,
        'x-user-roles': JSON.stringify(roles)
      }
    });
    const data = await response.json();

    if (data.statusCode) {
      throw new ApiError({
        status: data.statusCode,
        message: data.message,
        code: data?.code
      });
    }

    return data;
  }
}
