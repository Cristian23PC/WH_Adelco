import { InjectRepository } from '@/nest-commercetools/decorators/nest-commercetools.decorators';
import { CustomObject } from '@commercetools/platform-sdk';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CustomObjectsRepository } from 'commercetools-sdk-repositories';

@Injectable()
export class DeliveryZonesService {
  private container = this.configService.get<string>('custom-object.t2zoneContainer');

  constructor(
    @InjectRepository(CustomObjectsRepository)
    private customObjectRepository: CustomObjectsRepository,
    private configService: ConfigService
  ) {}

  async getT2Zone(key: string): Promise<CustomObject> {
    return this.customObjectRepository.getByContainerAndKey(this.container, key);
  }
}
