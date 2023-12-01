import { InjectRepository } from '@/nest-commercetools';
import { BusinessUnit, BusinessUnitDraft, BusinessUnitUpdate, BusinessUnitUpdateAction, DivisionDraft } from '@commercetools/platform-sdk';
import { Injectable } from '@nestjs/common';
import { BusinessUnitsRepository } from '@/nest-commercetools/repositories/business-units';
import { IAddress, BusinessUnitRequest, ICustomerBusinessUnits, GetByIdMethodArgs, GetAllBusinessUnits } from './business-units.interface';
import { LoggerService } from '@/common/utils/logger/logger.service';
import loggerConfig from '@/config/logger.config';
import { ChannelsRepository } from 'commercetools-sdk-repositories';
import { DeliveryZonesService } from '@/delivery-zones/delivery-zones.service';
import { ErrorBuilder } from '@/common/utils/error-builder/error-builder';
import { BusinessUnitList, ConvertedBusinessUnit } from './models';
import { convertBusinessUnit as businessUnitConverter } from './converter';
import { buildCustomerDraft, buildDivisionDraft, buildRutCustomField } from '@/common/utils/parser/parser';
import { CreateDivisionRequestDto } from './dto/division.dto';
import { BU_ADMIN_ROLE } from '@/common/constants/roles';
import { CREATE_DIVISION_PERMISSIONS } from '@/business-units/constants/division';
import { ConfigService } from '@nestjs/config';
import { changeStatusAction, setBillingAddressActions, setChangeNameAction, setCustomFieldAction, setShippingAddressActions } from './actions';
import { SequenceService } from '@/sequence/sequence.service';
import { FilterGetAllBusinessUnits } from './dto/business-units.dto';
import { INTERNAL_ROLE } from '@/common/constants/roles';
import { SALES_ORIGIN } from '@/common/constants/origin';
import { EBusinessUnitsSortField } from './enum/business-units-sort-field.enum';
import { CustomersService } from '@/customers/customers.service';
import { BusinessUnitsHelper } from '@/common/helpers/business-units/business-units.helper';

export interface DistributionChannelMatcher {
  distributionCenterCode: string;
  customerGroup: string;
  salesSubchannel: string;
  businessUnitId: string;
}

export type TDivisionHeaders = {
  username: string;
  userRoles: string[];
};

@Injectable()
export class BusinessUnitsService {
  private readonly loggerService = new LoggerService(loggerConfig());
  private readonly defaultExpand = ['associates[*].customer', 'custom.fields.deliveryZone'];

  constructor(
    @InjectRepository(BusinessUnitsRepository)
    private readonly businessUnitsRepository: BusinessUnitsRepository,
    @InjectRepository(ChannelsRepository)
    private readonly channelsRepository: ChannelsRepository,
    private readonly deliveryZonesService: DeliveryZonesService,
    private readonly sequenceService: SequenceService,
    private readonly customersService: CustomersService,
    private readonly configService: ConfigService,
    private readonly businessUnitsHelper: BusinessUnitsHelper
  ) {}

  async createDivision(parentBusinessUnitId: string, newDivision: CreateDivisionRequestDto, { username, userRoles }: TDivisionHeaders): Promise<ConvertedBusinessUnit> {
    const parentBusinessUnit = await this.getById(parentBusinessUnitId);

    if (!parentBusinessUnit) {
      throw ErrorBuilder.buildError('businessUnitDoesNotExist');
    }

    if (
      userRoles.some(userRole => new Set(CREATE_DIVISION_PERMISSIONS).has(userRole)) ||
      parentBusinessUnit.associates.some(
        ({ customer, associateRoleAssignments }) =>
          customer?.obj?.email === username && associateRoleAssignments.some(roleAssignment => roleAssignment.associateRole.key === BU_ADMIN_ROLE)
      )
    ) {
      let deliveryZoneId: string;
      let division: CreateDivisionRequestDto;

      try {
        const [deliveryZone] = await this.deliveryZonesService.getDeliveryZonesByLocality(newDivision.address.city);
        deliveryZoneId = deliveryZone.id;
        division = { ...newDivision, address: { ...newDivision.address, city: deliveryZone.label } };
      } catch (error) {
        throw ErrorBuilder.buildError('noDeliveryZoneAssociated');
      }

      const businessUnitKey = await this.sequenceService.getBusinessUnitKey('businessUnitKey');

      let customer;

      try {
        customer = await this.customersService.getCustomerByEmail(newDivision.contactInfo.email);
      } catch (error) {
        this.loggerService.warn(`Customer ${newDivision.contactInfo.email} does not exist`);
      }

      if (!customer) {
        customer = (
          await this.customersService.createCustomer(
            buildCustomerDraft({
              firstName: newDivision.contactInfo.firstName,
              lastName: newDivision.contactInfo.lastName,
              phone: newDivision.contactInfo.phone,
              email: newDivision.contactInfo.email
            })
          )
        ).customer;
      } else {
        const divisions = await this.findDivisions(parentBusinessUnit, customer.id);
        if (!parentBusinessUnit.associates.some(associate => associate.customer?.obj?.email === customer.email) && !divisions?.length) {
          throw ErrorBuilder.buildError('customerAlreadyRegistered');
        }
      }

      const divisionDraft = buildDivisionDraft(businessUnitKey, customer.id, {
        parentBusinessUnit,
        deliveryZoneId,
        division
      });

      let origin: string = username;
      if (userRoles.includes(INTERNAL_ROLE)) {
        origin = SALES_ORIGIN;
      }

      return await this.createBusinessUnit(divisionDraft, origin);
    } else {
      throw ErrorBuilder.buildError('buNotAssociateCustomer');
    }
  }

  private async getCorrespondingDistributionChannel(matcher: DistributionChannelMatcher): Promise<string> {
    const channelsPage = await this.channelsRepository.find({
      queryArgs: { where: ['roles contains any ("ProductDistribution")', `custom(fields(distributionCenterCode="${matcher.distributionCenterCode}"))`], limit: 500 }
    });

    // Select the most specific distribution channel (price) for the business unit
    const distributionChannel =
      // match by customer group
      channelsPage.results.find(ch => {
        let bool = false;
        if (!!matcher.businessUnitId && matcher.businessUnitId === ch.custom?.fields.businessPartnerID) {
          bool = true;
        }
        return bool;
      }) ??
      // match by the combination channel / Subchannel
      channelsPage.results.find(
        ch =>
          !!matcher.salesSubchannel &&
          !!matcher.customerGroup &&
          matcher.customerGroup === ch.custom?.fields.customerGroup &&
          matcher.salesSubchannel === ch.custom?.fields.salesSubchannel
      ) ??
      // match only by sales channel
      channelsPage.results.find(ch => !ch.custom?.fields.salesSubchannel && !!matcher.customerGroup && matcher.customerGroup === ch.custom?.fields.customerGroup);

    if (!distributionChannel) {
      this.loggerService.error(
        `No matching distribution channel. Distribution Center: ${matcher.distributionCenterCode} Business Unit Group: ${matcher.businessUnitId} Sales Channel: ${matcher.customerGroup}`
      );
      return undefined;
    }
    return distributionChannel.id;
  }

  private async getDistributionChannelId(businessUnit: BusinessUnit) {
    let externalBusinessUnitId = businessUnit.custom?.fields.externalId;
    if (businessUnit.unitType === 'Division') {
      const company = await this.businessUnitsRepository.getByKey(businessUnit.topLevelUnit.key, {
        queryArgs: { expand: this.defaultExpand }
      });
      externalBusinessUnitId = company.custom?.fields.externalId;
    }
    const matcher = {
      distributionCenterCode: businessUnit.custom?.fields.deliveryZone?.obj?.value.dcCode,
      customerGroup: businessUnit.custom?.fields.customerGroupCode,
      salesSubchannel: businessUnit.custom?.fields.salesSubchannel,
      businessUnitId: externalBusinessUnitId
    };
    return matcher.distributionCenterCode && (matcher.customerGroup || matcher.businessUnitId) ? await this.getCorrespondingDistributionChannel(matcher) : undefined;
  }

  private async findDivisions(parentBusinessUnit: BusinessUnit, customerId?: string): Promise<BusinessUnit[]> {
    const divisionLimit = parseInt(this.configService.get<string>('businessUnits.divisionLimit'));
    const { results, total } = await this.businessUnitsRepository.find({
      queryArgs: {
        where: [`parentUnit(key="${parentBusinessUnit.key}")`, customerId && `associates(customer(id="${customerId}"))`].filter(Boolean),
        expand: this.defaultExpand,
        limit: divisionLimit
      }
    });

    if (total > divisionLimit) {
      this.loggerService.error(`There are more than ${divisionLimit} division`);
    }

    return results.map(div => div).flat();
  }

  async findBusinessUnits(customerId: string): Promise<ICustomerBusinessUnits> {
    const response = await this.businessUnitsRepository.find({
      queryArgs: { where: [`associates(customer(id="${customerId}"))`], expand: this.defaultExpand }
    });
    // Company whas not has more than one BU
    const company = response.results.find(businessUnit => businessUnit.unitType === 'Company');

    const divisions = company ? await this.findDivisions(company) : [];

    const businessUnitsToProcess = !company ? response.results : [company, ...divisions];

    const businessUnits = await Promise.all(
      businessUnitsToProcess.map(async bu => {
        const distributionChannelId = await this.getDistributionChannelId(bu);
        return { ...businessUnitConverter(bu, distributionChannelId), ...this.businessUnitsHelper.getMinimumOrderAmount() };
      })
    );

    return { businessUnits };
  }

  async findByRut(rut: string): Promise<BusinessUnit[]> {
    const response = await this.businessUnitsRepository.find({
      queryArgs: { where: [`custom(fields(rut="${rut}"))`], expand: this.defaultExpand }
    });

    return response.results;
  }

  async getConvertedById(id: string): Promise<ConvertedBusinessUnit> {
    const methodArgs = { queryArgs: { expand: this.defaultExpand } };
    const businessUnit = await this.getById(id, methodArgs);
    return this.convertBusinessUnit({
      ...businessUnit,
      ...this.businessUnitsHelper.getMinimumOrderAmount()
    });
  }

  async getById(id: string, methodArgs?: GetByIdMethodArgs): Promise<BusinessUnit> {
    return this.businessUnitsRepository.getById(id, { queryArgs: { ...methodArgs?.queryArgs, expand: this.defaultExpand } });
  }

  async updateById(id: string, body: BusinessUnitUpdate): Promise<BusinessUnit> {
    return this.businessUnitsRepository.updateById(id, { body, queryArgs: { expand: this.defaultExpand } });
  }

  async update(id: string, body: BusinessUnitRequest, email: string): Promise<ConvertedBusinessUnit> {
    const businessUnit = await this.getById(id, { queryArgs: { expand: ['associates[*].customer'] } });
    if (!businessUnit.associates.find(associate => associate.customer?.obj?.email === email)) {
      throw ErrorBuilder.buildError('buNotAssociateCustomer');
    }
    const actions = await this.createBusinessUnitUpdateActions(body, businessUnit);

    const updatedBusinessUnit = await this.updateById(id, {
      version: businessUnit.version,
      actions
    });

    const distributionChannelId = await this.getDistributionChannelId(updatedBusinessUnit);
    return businessUnitConverter(updatedBusinessUnit, distributionChannelId);
  }

  async getDeliveryZoneByAddress(address: IAddress) {
    const [deliveryZone] = await this.deliveryZonesService.getDeliveryZonesByLocality(address.city);

    return deliveryZone;
  }

  async createBusinessUnitUpdateActions(body: BusinessUnitRequest, businessUnit: BusinessUnit): Promise<BusinessUnitUpdateAction[]> {
    const deliveryZone = await this.getDeliveryZoneByAddress(body.address);
    return [
      ...setChangeNameAction(body?.name),
      ...setCustomFieldAction(deliveryZone.id, body.tradeName),
      ...setShippingAddressActions(body.address, businessUnit.addresses),
      ...setBillingAddressActions(body?.billingAddress, businessUnit.addresses),
      ...((businessUnit.status !== 'Active' && changeStatusAction()) || [])
    ].filter(item => item);
  }

  async createBusinessUnit(businessUnitDraft: BusinessUnitDraft | DivisionDraft, origin?: string): Promise<ConvertedBusinessUnit> {
    const createdBusinessUnit = await this.businessUnitsRepository.create({
      body: businessUnitDraft,
      queryArgs: { expand: this.defaultExpand },
      headers: origin
        ? {
            'X-External-User-ID': origin
          }
        : undefined
    });
    const distributionChannelId = await this.getDistributionChannelId(createdBusinessUnit);
    return businessUnitConverter(createdBusinessUnit, distributionChannelId);
  }

  async convertBusinessUnit(bussinessUnit: BusinessUnit): Promise<ConvertedBusinessUnit> {
    const distributionChannelId = await this.getDistributionChannelId(bussinessUnit);
    return businessUnitConverter(bussinessUnit, distributionChannelId);
  }

  async findConvertedByRut(rut: string): Promise<ConvertedBusinessUnit[]> {
    const ctBusinessUnits = await this.findByRut(buildRutCustomField(rut));
    return Promise.all(ctBusinessUnits.map(bu => this.convertBusinessUnit({ ...bu, ...this.businessUnitsHelper.getMinimumOrderAmount() })));
  }

  async getConvertedByKey(key: string) {
    const businessUnit = await this.businessUnitsRepository.getByKey(key, { queryArgs: { expand: this.defaultExpand } });

    return this.convertBusinessUnit(businessUnit);
  }

  async deleteById(id: string, version: number): Promise<BusinessUnit> {
    return this.businessUnitsRepository.deleteById(id, { queryArgs: { version } });
  }

  // Init Get All Bussiness Units
  async getAllBusinessUnits(filterGetAllBusinessUnits: FilterGetAllBusinessUnits): Promise<BusinessUnitList[]> {
    const sortField = filterGetAllBusinessUnits.sortField === EBusinessUnitsSortField.rut ? 'custom.fields.rut' : filterGetAllBusinessUnits.sortField;
    const methodArgs: GetAllBusinessUnits = {
      queryArgs: {
        sort: `${sortField} ${filterGetAllBusinessUnits.sort}`,
        limit: filterGetAllBusinessUnits.limit,
        offset: filterGetAllBusinessUnits.offset,
        expand: ['associates[*].customer']
      }
    };
    const businessUnits = await this.businessUnitsRepository.find(methodArgs);
    return businessUnits.results.map(businessUnit => {
      return {
        id: businessUnit.id,
        name: businessUnit.name,
        rut: businessUnit.custom?.fields.rut ?? '',
        addresses: businessUnit.addresses,
        email: businessUnit.associates.length ? businessUnit.associates.shift().customer.obj.email : ''
      };
    });
  }
}
