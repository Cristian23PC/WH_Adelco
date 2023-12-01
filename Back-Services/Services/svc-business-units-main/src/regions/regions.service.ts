import { InjectRepository } from '@/nest-commercetools';
import { CustomObject } from '@commercetools/platform-sdk';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CustomObjectsRepository } from 'commercetools-sdk-repositories';
import { Region, IRegionCustomObjectValue } from './models';

@Injectable()
export class RegionsService {
  constructor(
    @InjectRepository(CustomObjectsRepository)
    private readonly customObjectRepository: CustomObjectsRepository,
    private readonly configService: ConfigService
  ) {}

  async getRegions(): Promise<Region[]> {
    const container = this.configService.get<string>('custom-object.regionsContainer');

    const response = await this.customObjectRepository.find({
      queryArgs: { where: [`container = "${container}"`], limit: 500 }
    });

    return response.results.map((customObject: CustomObject) => {
      const label: string = (customObject.value as IRegionCustomObjectValue).label;

      return {
        key: customObject.key,
        label
      } as Region;
    });
  }
}
