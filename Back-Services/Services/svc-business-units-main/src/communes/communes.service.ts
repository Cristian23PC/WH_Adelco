import { InjectRepository } from '@/nest-commercetools';
import { CustomObject } from '@commercetools/platform-sdk';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CustomObjectsRepository } from 'commercetools-sdk-repositories';
import { Commune, ICommuneCustomObjectValue } from './models';

@Injectable()
export class CommunesService {
  constructor(
    @InjectRepository(CustomObjectsRepository)
    private readonly customObjectRepository: CustomObjectsRepository,
    private readonly configService: ConfigService
  ) {}

  async getCommunes(regionKey: string): Promise<Commune[]> {
    const container = this.configService.get<string>('custom-object-commune.communesContainer');

    const response = await this.customObjectRepository.find({
      queryArgs: {
        where: [`container = "${container}" and value(region="${regionKey}")`],
        limit: 500
      }
    });

    return response.results.map((customObject: CustomObject) => {
      const { label, region } = customObject.value as ICommuneCustomObjectValue;

      return {
        key: customObject.key,
        label,
        region
      } as Commune;
    });
  }

  async getCommune(communeKey: string): Promise<Commune> {
    const container = this.configService.get<string>('custom-object-commune.communesContainer');

    const commune = await this.customObjectRepository.getByContainerAndKey(container, communeKey);

    if (!commune) {
      return undefined;
    }
    const { label, region } = commune.value as ICommuneCustomObjectValue;
    return {
      key: commune.key,
      label,
      region
    } as Commune;
  }
}
