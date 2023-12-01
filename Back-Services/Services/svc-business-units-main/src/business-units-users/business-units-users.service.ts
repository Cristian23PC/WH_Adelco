import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { KeycloakService } from '@/keycloak/keycloak.service';
import { ICustomerBusinessUnits } from '@/business-units/business-units.interface';
import { BusinessUnitsService } from '@/business-units/business-units.service';
import { RutService } from '@/rut/rut.service';
import { buildBusinessUnitDraft, buildCustomerDraft, getVerificationCode, buildRutCustomField } from '@/common/utils/parser/parser';
import { ErrorBuilder } from '@/common/utils/error-builder/error-builder';
import { KeycloakUserAttributes, KeycloakUserCreationResponse } from '@/keycloak/interfaces/keycloak.interface';
import { ApiError } from '@/common/errors/api.error';
import { ConvertedBusinessUnit } from '@/business-units/models';
import { ConfigService } from '@nestjs/config';
import { CustomersService } from '@/customers/customers.service';
import {
  CompleteRegistrationRequest,
  PreRegistrationRequest,
  RepRegistrationRequest,
  UserAndRutValidationRequest,
  UserAndRutValidationResponse
} from './business-units-users.interface';
import { ResetPasswordRequestDto, ValidateVerificationCodeDto, VerificationCodeRequestDto } from './dto/business-units-users.dto';
import { buildSetAssociatesAction } from '@/business-units/actions';
import { SequenceService } from '@/sequence/sequence.service';
import { INTERNAL_ROLE } from '@/common/constants/roles';
import { SALES_ORIGIN } from '@/common/constants/origin';
import { Customer } from '@commercetools/platform-sdk';

@Injectable()
export class BusinessUnitsUsersService {
  constructor(
    private rutService: RutService,
    private keycloakService: KeycloakService,
    private businessUnitsService: BusinessUnitsService,
    private customersService: CustomersService,
    private sequenceService: SequenceService,
    private configService: ConfigService
  ) {}

  async findBusinessUnitsForUser(email: string): Promise<ICustomerBusinessUnits> {
    const customer = await this.customersService.getCustomerByEmail(email);
    return await this.businessUnitsService.findBusinessUnits(customer.id);
  }

  private validateUsername(username: string): void {
    const validUsernamePattern = this.configService.get('business-unit-users.validUsernameList');

    if (!username.match(new RegExp(validUsernamePattern))) {
      throw ErrorBuilder.buildError('invalidUsername');
    }
  }

  async preRegistration({ username, rut, firstName, lastName, phone, password }: PreRegistrationRequest): Promise<KeycloakUserCreationResponse> {
    this.validateUsername(username);
    const { access_token } = await this.keycloakService.getAuthToken();
    const businessName = await this.rutService.getBusinessNameFromValidRut(rut);
    await this.validateUserNotRegisteredInKeycloak(username, access_token);
    const businessUnits = await this.getBusinessUnits(username);
    await this.validateUserIsAlreadyRegistered(rut, businessUnits);
    return await this.keycloakService.createUser(
      {
        username,
        firstName,
        lastName,
        email: username,
        attributes: {
          contactPhone: [phone],
          companyRut: [rut],
          companyName: [businessName]
        },
        credentials: [
          {
            credentialData: 'password',
            value: password
          }
        ]
      },
      access_token
    );
  }

  async completeRegistration({ username, code }: CompleteRegistrationRequest): Promise<ConvertedBusinessUnit> {
    const { access_token } = await this.keycloakService.getAuthToken();
    const {
      userId,
      firstName,
      lastName,
      email,
      attributes: { companyRut: [rut] = [], contactPhone: [phone] = [], companyName: [companyName] = [] }
    } = await this.validateKeycloakUserCode(username, code, access_token);

    await this.keycloakService.updateUser(userId, access_token, { requiredActions: [], emailVerified: true });
    const businessUnits = await this.getBusinessUnits(username);
    await this.validateUserIsAlreadyRegistered(rut, businessUnits);
    const ctCustomer = await this.getOrCreateCustomer({ firstName, lastName, phone, email }, userId);
    return await this.getOrCreateBusinessUnit(ctCustomer.customer.id, rut, companyName);
  }

  async requestVerificationCode({ username }: VerificationCodeRequestDto): Promise<void> {
    return this.keycloakService.generateVerificationCode(username);
  }

  async resetPassword({ username, password, code }: ResetPasswordRequestDto): Promise<void> {
    const { access_token } = await this.keycloakService.getAuthToken();

    const keycloakUser = await this.validateKeycloakUserCode(username, code, access_token, false);

    const { userId, attributes } = keycloakUser;

    await this.keycloakService.updateUser(userId, access_token, { attributes, requiredActions: [], emailVerified: true });
    await this.keycloakService.resetPassword(userId, password, access_token);
  }

  async validateVerificationCode({ username, code }: ValidateVerificationCodeDto): Promise<void> {
    const { access_token } = await this.keycloakService.getAuthToken();
    await this.validateKeycloakUserCode(username, code, access_token, false);
  }

  async getOrCreateCustomer({ firstName, lastName, phone, email }, userId: string) {
    try {
      const customer = await this.customersService.getCustomerByEmail(email);

      return { customer };
    } catch (err) {
      if (err instanceof NotFoundException) {
        return this.customersService.createCustomer(buildCustomerDraft({ firstName, lastName, phone, email }, userId));
      }

      throw err;
    }
  }

  async getOrCreateBusinessUnit(customerId: string, rut: string, companyName: string): Promise<ConvertedBusinessUnit> {
    try {
      const businessUnits = await this.businessUnitsService.findConvertedByRut(rut);
      const company = businessUnits.find(businessUnit => businessUnit.unitType === 'Company');
      if (!company) {
        throw new ApiError({ statusCode: 404, message: `Company with rut ${rut}, not found.` } as unknown as ApiError);
      }
      return businessUnits[0];
    } catch (err) {
      if (err.statusCode === 404) {
        const businessUnitKey = await this.sequenceService.getBusinessUnitKey('businessUnitKey');
        return await this.businessUnitsService.createBusinessUnit(buildBusinessUnitDraft(businessUnitKey, { rut }, companyName, customerId));
      }
      throw err;
    }
  }

  async validateUserAndRut({ username, rut }: UserAndRutValidationRequest): Promise<UserAndRutValidationResponse> {
    const { access_token } = await this.keycloakService.getAuthToken();
    await this.validateUserNotRegisteredInKeycloak(username, access_token);
    const businessName = await this.rutService.getBusinessNameFromValidRut(rut);

    const businessUnits = await this.getBusinessUnits(username);

    await this.validateUserIsAlreadyRegistered(rut, businessUnits);

    return {
      username: username,
      rut: rut,
      buName: businessName
    };
  }

  async validateKeycloakUserCode(
    username: string,
    code: string,
    access_token: string,
    shouldValidateKeycloakVerificationEmail = true
  ): Promise<{ userId: string; firstName: string; lastName: string; email: string; attributes: KeycloakUserAttributes }> {
    const [keycloakUser] = await this.keycloakService.getByUsername(username, access_token);
    if (!keycloakUser) {
      throw new NotFoundException('User does not exist');
    }
    if (shouldValidateKeycloakVerificationEmail && keycloakUser.emailVerified === true) {
      throw ErrorBuilder.buildError('keycloakUserAlreadyRegister');
    }
    const now = Math.floor(Date.now() / 1000);
    const expirationTime = this.configService.get<number>('business-unit-users.codeExpirationTime');
    const { id, attributes, firstName, lastName, email } = keycloakUser;
    const [verificationCodeData] = attributes?.verificationCodeData || [];
    const [remainingAttemptsAsString] = attributes?.remainingAttempts ?? ['0'];
    const remainingAttempts = Number.parseInt(remainingAttemptsAsString);

    if (!verificationCodeData) {
      throw ErrorBuilder.buildError('invalidCode');
    }
    const { verificationCode, epochTime } = getVerificationCode(verificationCodeData);

    if (remainingAttempts === 0 || now > epochTime + expirationTime) {
      throw ErrorBuilder.buildError('invalidCode');
    }

    if (Number(code) !== Number.parseInt(verificationCode)) {
      const remainingAttemptsUpdated = remainingAttempts - 1;
      await this.keycloakService.updateUser(id, access_token, { attributes: { ...attributes, remainingAttempts: [`${remainingAttemptsUpdated}`] } });

      throw ErrorBuilder.buildError('wrongVerificationAttempt', { remainingAttempts: remainingAttemptsUpdated });
    }

    // If code is validated return the user ID for follow-up calls
    return { userId: id, firstName, lastName, email, attributes };
  }

  async validateUserNotRegisteredInKeycloak(username: string, access_token: string): Promise<ApiError | void> {
    const keycloakUsers = await this.keycloakService.getByUsername(username, access_token);
    if (keycloakUsers.length > 0) {
      throw ErrorBuilder.buildError('keycloakUserAlreadyRegister');
    }
  }

  async getBusinessUnits(username: string): Promise<ICustomerBusinessUnits | undefined> {
    try {
      return await this.findBusinessUnitsForUser(username);
    } catch (error) {}
  }

  private async validateRutExist(rut: string): Promise<ApiError | void> {
    const businessUnitsByRut = await this.businessUnitsService.findByRut(buildRutCustomField(rut));

    if (businessUnitsByRut !== null && businessUnitsByRut !== undefined && businessUnitsByRut.length) {
      throw ErrorBuilder.buildError('rutAlreadyRegistered');
    }
  }

  async validateUserIsAlreadyRegistered(rut: string, businessUnits?: ICustomerBusinessUnits, failIfRegistered = false): Promise<ApiError | void> {
    const company = this.getCompany(businessUnits);
    if (company) {
      if (company.rut && company.rut !== buildRutCustomField(rut)) {
        throw ErrorBuilder.buildError('usernameAlreadyRegistered');
      } else if (failIfRegistered) {
        throw ErrorBuilder.buildError('userAlreadyAssociatedToBu');
      }
    } else {
      await this.validateRutExist(rut);
    }
  }

  getCompany(businessUnits?: ICustomerBusinessUnits): ConvertedBusinessUnit | undefined {
    return businessUnits?.businessUnits.find(businessUnit => businessUnit.unitType === 'Company');
  }

  async repRegistration(body: RepRegistrationRequest, xUserRoles: string[]): Promise<ConvertedBusinessUnit> {
    if (!xUserRoles.includes(INTERNAL_ROLE)) {
      throw new ForbiddenException('Insufficient permissions');
    }
    const businessName = await this.rutService.getBusinessNameFromValidRut(body.rut);
    let businessUnits: ICustomerBusinessUnits;
    if (body?.username) {
      businessUnits = await this.getBusinessUnits(body?.username);
    }
    await this.validateUserIsAlreadyRegistered(body.rut, businessUnits, true);

    let businessUnit: ConvertedBusinessUnit;
    let customer: Customer;
    try {
      const deliveryZone = await this.businessUnitsService.getDeliveryZoneByAddress(body.address);

      const businessUnitKey = await this.sequenceService.getBusinessUnitKey('businessUnitKey');
      const businessUnitDraft = buildBusinessUnitDraft(businessUnitKey, body, businessName, undefined, deliveryZone.id);
      businessUnit = await this.businessUnitsService.createBusinessUnit({ ...businessUnitDraft, status: 'Active' }, SALES_ORIGIN);
      const email = body?.username ?? `${businessUnitKey}.${body.rut}@fake.com`;
      const customerDraft = buildCustomerDraft({ firstName: body?.firstName, lastName: body?.lastName, phone: body?.phone, email }, undefined, body?.isFakeCustomer);
      customer = (await this.customersService.createCustomer(customerDraft)).customer;
      //Associate customer to businessUnit
      return {
        ...businessUnit,
        ...(await this.businessUnitsService.updateById(businessUnit.id, { version: businessUnit.version, actions: buildSetAssociatesAction(customer.id) }))
      };
    } catch (error) {
      if (businessUnit) {
        await this.businessUnitsService.deleteById(businessUnit.id, businessUnit.version);
      }

      if (customer) {
        await this.customersService.deleteById(customer.id, customer.version);
      }

      throw error;
    }
  }
}
