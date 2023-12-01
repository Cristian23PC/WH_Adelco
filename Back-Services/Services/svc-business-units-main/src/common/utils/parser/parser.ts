import { RepRegistrationRequest } from '@/business-units-users/business-units-users.interface';
import { CreateDivisionRequestDto } from '@/business-units/dto/division.dto';
import { Address, AssociateDraft, BaseAddress, BusinessUnit, CompanyDraft, CustomerDraft, DivisionDraft } from '@commercetools/platform-sdk';
import { IBuildCustomerDraft } from './parser.interface';
import { removeUndefinedValues } from '@/common/formatter/formatter';

export const ADMIN_ROLE = 'admin-role';

export const generateVerificationCodeData = (): string => {
  const digits = 4;
  const epochTime = Math.floor(Date.now() / 1000); // current epoch time in seconds
  const verificationCode = Math.floor(Math.random() * 10 ** digits)
    .toString()
    .padStart(digits, '0');

  return Buffer.from(`${verificationCode}_${epochTime}`).toString('base64');
};

export const getVerificationCode = (verificationCodeData: string) => {
  const buff = Buffer.from(verificationCodeData, 'base64').toString('utf-8');
  const [verificationCode, epochTime] = buff.split('_');

  return { verificationCode, epochTime: Number.parseInt(epochTime) };
};

export const buildCustomerAddress = (phone: string, country = 'CL'): Address => {
  return {
    country,
    phone
  };
};

export const buildCustomerDraft = ({ firstName, lastName, phone, email }: IBuildCustomerDraft, externalId?: string, isFakeCustomer = false): CustomerDraft => {
  return removeUndefinedValues({
    email,
    firstName,
    lastName,
    externalId,
    isEmailVerified: true,
    authenticationMode: 'ExternalAuth',
    addresses: [buildCustomerAddress(phone)],
    custom: {
      type: {
        typeId: 'type',
        key: 'adelco-customer-type'
      },
      fields: {
        isFake: isFakeCustomer
      }
    }
  });
};
/**
 * it removes "." and allow "-" and make last letter to capital case
 * @param rut
 * @returns
 */
export const buildRutCustomField = (rut: string) => {
  const rutWithoutDots = rut.replace(/\./g, '');

  const lastCharacter = rutWithoutDots.slice(-1).toUpperCase();

  const rutWithoutLastCharacter = rutWithoutDots.slice(0, -1);

  if (rutWithoutLastCharacter.endsWith('-')) {
    return rutWithoutLastCharacter + lastCharacter;
  } else {
    return rutWithoutLastCharacter + '-' + lastCharacter;
  }
};

type TDivisionDraft = {
  parentBusinessUnit: BusinessUnit;
  division: CreateDivisionRequestDto;
  deliveryZoneId: string;
  divisionName?: string;
};

const createAddressMap = (address, { department, additionalAddressInfo }): BaseAddress => {
  return {
    ...address,
    country: address.country ?? 'CL',
    department,
    additionalAddressInfo
  };
};

export const buildDivisionDraft = (key: string, customerId: string, { parentBusinessUnit, divisionName, division, deliveryZoneId }: TDivisionDraft): DivisionDraft => {
  const rut = parentBusinessUnit.custom.fields.rut;
  const { commune: communeAddress, otherInformation: otherInformationAddress, ...address } = division.address;
  const mappedAddress: BaseAddress = createAddressMap(address, { department: communeAddress, additionalAddressInfo: otherInformationAddress });

  let mappedBillingAddress: BaseAddress;
  if (Object.keys(division.billingAddress || {}).length) {
    const { commune: communeBillingAddress, otherInformation: otherInformationBillingAddress, ...billingAddress } = division.billingAddress;
    mappedBillingAddress = createAddressMap(billingAddress, {
      department: communeBillingAddress,
      additionalAddressInfo: otherInformationBillingAddress
    });
  }

  const defaultBillingAddress = (mappedBillingAddress && 1) || 0;
  const defaultShippingAddress = 0;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { externalId, ...otherFields } = parentBusinessUnit.custom.fields;

  return {
    unitType: 'Division',
    parentUnit: {
      typeId: 'business-unit',
      id: parentBusinessUnit.id
    },
    addresses: [{ ...mappedAddress, ...division.contactInfo }, mappedBillingAddress].filter(Boolean),
    name: divisionName ?? `Division ${rut}`,
    key,
    status: 'Active',
    associates: buildAssociatesDraft(customerId),
    defaultBillingAddress,
    defaultShippingAddress,
    custom: {
      type: {
        typeId: 'type',
        key: 'adelco-business-unit-type'
      },
      fields: {
        ...otherFields,
        deliveryZone: {
          typeId: 'key-value-document',
          id: deliveryZoneId
        },
        tradeName: division.tradeName
      }
    }
  };
};

const buildAssociatesDraft = (customerId?: string): AssociateDraft[] =>
  customerId
    ? [
        {
          associateRoleAssignments: [{ associateRole: { key: ADMIN_ROLE, typeId: 'associate-role' }, inheritance: 'Enabled' }],
          customer: {
            id: customerId,
            typeId: 'customer'
          }
        }
      ]
    : [];

export const buildBusinessUnitDraft = (
  key: string,
  repRegistrationBody: Partial<RepRegistrationRequest>,
  companyName?: string,
  customerId?: string,
  deliveryZoneId?: string
): CompanyDraft => {
  const { rut, tradeName } = repRegistrationBody;

  let mappedAddress: BaseAddress;

  if (repRegistrationBody.address) {
    const { commune: communeAddress, otherInformation: otherInformationAddress, ...address } = repRegistrationBody.address;
    mappedAddress = createAddressMap(address, { department: communeAddress, additionalAddressInfo: otherInformationAddress });
  }

  let mappedBillingAddress: BaseAddress;
  if (repRegistrationBody.billingAddress) {
    const { commune: communeBillingAddress, otherInformation: otherInformationBillingAddress, ...billingAddress } = repRegistrationBody.billingAddress;
    mappedBillingAddress = createAddressMap(billingAddress, {
      department: communeBillingAddress,
      additionalAddressInfo: otherInformationBillingAddress
    });
  }

  const defaultBillingAddress = mappedAddress ? (mappedBillingAddress && 1) || 0 : undefined;
  const defaultShippingAddress = mappedAddress ? 0 : undefined;

  return {
    unitType: 'Company',
    name: companyName ?? `Company ${rut}`,
    key,
    status: 'Inactive',
    addresses: [mappedAddress, mappedBillingAddress].filter(Boolean),
    defaultBillingAddress,
    defaultShippingAddress,
    associates: buildAssociatesDraft(customerId),
    custom: {
      type: {
        typeId: 'type',
        key: 'adelco-business-unit-type'
      },
      fields: {
        rut: buildRutCustomField(rut),
        ...(deliveryZoneId && {
          deliveryZone: {
            typeId: 'key-value-document',
            id: deliveryZoneId
          },
          tradeName,
          customerGroupCode: '01',
          shouldApplyT2Rate: true,
          isCreditEnabled: false,
          isCreditBlocked: false,
          taxProfile: '1'
        })
      }
    }
  };
};
