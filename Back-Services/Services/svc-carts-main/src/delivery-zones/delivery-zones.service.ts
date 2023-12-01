import { InjectRepository } from '@/nest-commercetools/decorators/nest-commercetools.decorators';
import { CustomObject } from '@commercetools/platform-sdk';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CustomObjectsRepository } from 'commercetools-sdk-repositories';
import { IDeliveryZoneValue } from './delivery-zones.interface';

@Injectable()
export class DeliveryZonesService {
  constructor(
    @InjectRepository(CustomObjectsRepository)
    private customObjectRepository: CustomObjectsRepository,
    private configService: ConfigService
  ) {}

  container = this.configService.get<string>('custom-object.t2zoneContainer');

  async getT2Zone(key: string): Promise<CustomObject> {
    return this.customObjectRepository.getByContainerAndKey(this.container, key);
  }

  async getAndValidateDeliveryZone(key: string): Promise<IDeliveryZoneValue> {
    const deliveryZone = await this.getT2Zone(key);
    const { dcCode, t2Rate } = (deliveryZone.value as IDeliveryZoneValue) || {};
    if (!dcCode || !t2Rate) {
      throw new BadRequestException('Delivery zone missing data');
    }
    return { dcCode, t2Rate };
  }

  async getById(id: string): Promise<CustomObject> {
    const { results } = await this.customObjectRepository.findByContainer(this.container, { queryArgs: { where: [`id="${id}"`] } });

    if (!results.length) {
      throw new NotFoundException('Delivery zone not found');
    }

    return results[0];
  }
}
