import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ConvertedBusinessUnit, ICustomerBusinessUnits, RepRegistrationRequest } from './business-units.interface';
import { ConfigService } from '@nestjs/config';
import { USER_CSR_ROLE } from '@/common/constants/carts';
import { ErrorBuilder } from '@/common/utils/error-builder/error-builder';
import { BusinessUnit } from '@commercetools/platform-sdk';
import { BusinessUnitsRepository } from '@/nest-commercetools/repositories/business-units';
import { ROLE_INTERNAL } from '@/common/constants/roles';
import { ApiError } from '@/common/errors/api.error';

@Injectable()
export class BusinessUnitsService {
  constructor(private readonly configService: ConfigService, private readonly businessUnitsRepository: BusinessUnitsRepository) {}

  private businessUnitsBaseUrl = this.configService.get<string>('businessUnits.baseUrl');
  private readonly defaultExpand = ['associates[*].customer', 'custom.fields.deliveryZone'];

  async getBusinessUnitsForCustomer(userId: string): Promise<ICustomerBusinessUnits> {
    const response = await fetch(`${this.businessUnitsBaseUrl}/users/me/business-units`, {
      method: 'GET',
      headers: {
        'x-user-id': userId
      },
      redirect: 'follow'
    });
    const data = await response.json();
    if (data.statusCode) {
      throw new NotFoundException(data.message);
    }

    return data;
  }

  async getBusinessUnitById(buId: string): Promise<ConvertedBusinessUnit> {
    const response = await fetch(`${this.businessUnitsBaseUrl}/business-unit/${buId}`, {
      method: 'GET',
      redirect: 'follow'
    });
    const data = await response.json();
    if (data.statusCode) {
      throw ErrorBuilder.buildError('buNotFound', { id: buId });
    }

    return data;
  }

  async findBusinessUnitByIdAndCustomer(id: string, userId: string): Promise<ConvertedBusinessUnit> {
    const { businessUnits } = await this.getBusinessUnitsForCustomer(userId);
    const businessUnit = businessUnits.find(businessUnit => businessUnit.id === id);
    if (!businessUnit) {
      throw ErrorBuilder.buildError('buNotFound', { id });
    }

    if (!businessUnit.key) {
      throw new BadRequestException('Business unit has no key');
    }
    return businessUnit;
  }

  async getAndValidateBusinessUnit(userId: string, id: string, userRoles?: string[]): Promise<ConvertedBusinessUnit> {
    let businessUnit;
    if (userRoles?.some(role => role === USER_CSR_ROLE)) {
      businessUnit = await this.getBusinessUnitById(id);
    } else {
      businessUnit = await this.findBusinessUnitByIdAndCustomer(id, userId);
    }
    if (!businessUnit?.deliveryZoneKey) {
      throw new BadRequestException('Business unit missing delivery zone');
    }
    if (!businessUnit?.distributionChannelId) {
      throw new BadRequestException('Business unit missing distribution channel');
    }
    return businessUnit;
  }

  async findByRut(rut: string): Promise<BusinessUnit> {
    const { results } = await this.businessUnitsRepository.find({
      queryArgs: { where: [`custom(fields(rut="${rut}"))`], limit: 1, expand: this.defaultExpand }
    });

    return results[0];
  }

  async findBusinessUnitByAssociateId(associateId?: string): Promise<BusinessUnit> {
    if (!associateId) return;

    const { results } = await this.businessUnitsRepository.find({
      queryArgs: { where: [`associates(customer(id="${associateId}"))`], expand: this.defaultExpand, limit: 1 }
    });

    return results[0];
  }

  async repRegistration(body: RepRegistrationRequest, isFakeCustomer: boolean): Promise<ConvertedBusinessUnit> {
    const response = await fetch(`${this.businessUnitsBaseUrl}/users/rep-registration`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-roles': JSON.stringify([ROLE_INTERNAL])
      },
      redirect: 'follow',
      body: JSON.stringify({ ...body, isFakeCustomer })
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
