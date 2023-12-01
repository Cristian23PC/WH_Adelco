import { ApiError } from '@/common/errors/api.error';
import { InjectRepository } from '@/nest-commercetools';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CustomObjectsRepository } from 'commercetools-sdk-repositories';

@Injectable()
export class SequenceService {
  constructor(
    @InjectRepository(CustomObjectsRepository)
    private readonly customObjectsRepository: CustomObjectsRepository,
    private readonly configService: ConfigService
  ) {}

  private sequenceContainer = this.configService.get<string>('custom-object-sequence.sequenceContainer');

  async getOrderNumber(key: string): Promise<string> {
    const orderNumberKey = this.configService.get<string>(`custom-object-sequence.${key}`);
    const lastValue = await this.customObjectsRepository.getByContainerAndKey(this.sequenceContainer, orderNumberKey);

    const newValue = {
      ...lastValue,
      value: lastValue.value + 1
    };

    try {
      const { value } = await this.customObjectsRepository.create({ body: newValue });
      const year = new Date().getFullYear().toString().slice(-2);
      const uniqueNumber = String(value).padStart(8, '0');

      return `${year}${uniqueNumber}`;
    } catch (e) {
      if (e.statusCode === 409) {
        return this.getOrderNumber(key);
      }
      throw new ApiError(e);
    }
  }
}
