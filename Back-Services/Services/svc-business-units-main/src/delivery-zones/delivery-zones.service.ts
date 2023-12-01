import { InjectRepository } from '@/nest-commercetools';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CustomObjectsRepository, ChannelsRepository } from 'commercetools-sdk-repositories';
import slugify from 'slugify';
import { convertDeliveryZone } from './converter/delivery-zones.converter';
import { DeliveryZone } from './models';
import { CustomObject } from '@commercetools/platform-sdk';
import { BusinessUnitsHelper } from '@/common/helpers/business-units/business-units.helper';

@Injectable()
export class DeliveryZonesService {
  constructor(
    @InjectRepository(CustomObjectsRepository)
    private readonly customObjectRepository: CustomObjectsRepository,
    @InjectRepository(ChannelsRepository)
    private readonly channelsRepository: ChannelsRepository,
    private readonly configService: ConfigService,
    private readonly businessUnitsHelper: BusinessUnitsHelper
  ) {}

  private async getDC2DistributionChannelMap(customObjects: Partial<CustomObject>[]) {
    const defaultDistributionCenters = customObjects.reduce((acc: string[], obj: { value: object }) => {
      const distributionCenter = obj.value['dcCode'];
      return distributionCenter && !acc.includes(distributionCenter) ? [...acc, distributionCenter] : acc;
    }, []);

    const dc2DistributionChannelMap = {};
    for (const dcCode of defaultDistributionCenters) {
      const channelsPage = await this.channelsRepository.find({
        queryArgs: {
          where: [
            'roles contains any ("ProductDistribution")',
            `custom(fields(distributionCenterCode="${dcCode}"))`,
            'custom(fields(customerGroup="01"))', //'Tradicional' Channel
            'custom(fields(salesSubchannel is not defined))'
          ],
          limit: 1
        }
      });

      if (channelsPage.results.length > 0) {
        dc2DistributionChannelMap[dcCode] = channelsPage.results[0].id;
      }
    }
    return dc2DistributionChannelMap;
  }

  async getDeliveryZones(communeKey: string): Promise<DeliveryZone[]> {
    const container = this.configService.get<string>('custom-object-delivery-zone.deliveryZoneContainer');

    const response = await this.customObjectRepository.find({
      queryArgs: {
        where: [`container = "${container}" and value(commune="${communeKey}")`],
        limit: 500
      }
    });

    const customObjects = response.results;

    return Promise.all(
      response.results.map(async customObject => {
        const convertedDeliveryZone = convertDeliveryZone(customObject, await this.getDC2DistributionChannelMap(customObjects));
        return {
          ...convertedDeliveryZone,
          ...this.businessUnitsHelper.getMinimumOrderAmount()
        };
      })
    );
  }

  async getDeliveryZonesByLocality(locality: string): Promise<DeliveryZone[]> {
    const container = this.configService.get<string>('custom-object-delivery-zone.deliveryZoneContainer');

    const response = await this.customObjectRepository.find({
      queryArgs: {
        where: [`container = "${container}" and key="${slugify(locality, { lower: true })}"`],
        limit: 500
      }
    });

    if (!response.results.length) throw new NotFoundException();

    return Promise.all(
      response.results.map(async customObject => {
        const convertedDeliveryZone = convertDeliveryZone(customObject, await this.getDC2DistributionChannelMap([customObject]));

        return {
          ...convertedDeliveryZone,
          ...this.businessUnitsHelper.getMinimumOrderAmount()
        };
      })
    );
  }
}
