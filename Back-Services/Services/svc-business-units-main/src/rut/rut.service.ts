import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ErrorBuilder } from '@/common/utils/error-builder/error-builder';

@Injectable()
export class RutService {
  constructor(private configService: ConfigService) {}

  async getBusinessNameFromValidRut(rut: string): Promise<string> {
    const verificationServiceUrl = this.configService.get('rut.verificationServiceUrl');
    const response = await fetch(`${verificationServiceUrl}/${rut}`);
    const data = await response.json();

    if (data.statusCode === 422) {
      throw ErrorBuilder.buildError('invalidRut');
    }

    if (data.statusCode === 200 && data.payload === null) {
      throw ErrorBuilder.buildError('noAssociatedBU');
    }

    if (data.statusCode === 200 && data.payload) {
      return data.payload.businessName;
    }

    throw ErrorBuilder.buildError('externalServiceError');
  }
}
