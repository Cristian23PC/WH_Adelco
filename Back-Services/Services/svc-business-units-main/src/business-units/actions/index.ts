import {
  Address,
  BusinessUnitAddAddressAction,
  BusinessUnitAddBillingAddressIdAction,
  BusinessUnitAddShippingAddressIdAction,
  BusinessUnitChangeAddressAction,
  BusinessUnitChangeNameAction,
  BusinessUnitChangeStatusAction,
  BusinessUnitSetAssociatesAction,
  BusinessUnitSetCustomFieldAction,
  BusinessUnitSetDefaultBillingAddressAction,
  BusinessUnitSetDefaultShippingAddressAction
} from '@commercetools/platform-sdk';
import { IAddress } from '../business-units.interface';

export const setShippingAddressActions = (
  address: IAddress,
  prevAddress: Address[]
): (BusinessUnitAddAddressAction | BusinessUnitAddShippingAddressIdAction | BusinessUnitSetDefaultShippingAddressAction | BusinessUnitChangeAddressAction)[] => {
  const key = 'shipping-address';
  return [
    ...mapAddAddressAction(address, key, !prevAddress.some(({ key: prevKey }) => key === prevKey)),
    {
      action: 'addShippingAddressId',
      addressKey: key
    },
    {
      action: 'setDefaultShippingAddress',
      addressKey: key
    }
  ];
};

export const setBillingAddressActions = (
  address?: IAddress,
  prevAddress?: Address[]
): (BusinessUnitAddAddressAction | BusinessUnitAddBillingAddressIdAction | BusinessUnitSetDefaultBillingAddressAction | BusinessUnitChangeAddressAction)[] => {
  if (!address) return [];
  const key = 'billing-address';

  return [
    ...mapAddAddressAction(address, key, !prevAddress?.some(({ key: prevKey }) => key === prevKey)),
    {
      action: 'addBillingAddressId',
      addressKey: key
    },
    {
      action: 'setDefaultBillingAddress',
      addressKey: key
    }
  ];
};

export const mapAddAddressAction = (address: IAddress, key: string, isNew: boolean): (BusinessUnitAddAddressAction | BusinessUnitChangeAddressAction)[] => {
  return [
    {
      action: isNew ? 'addAddress' : 'changeAddress',
      ...(!isNew && { addressKey: key }),
      address: {
        key,
        country: address.country,
        city: address.city,
        streetName: address.streetName,
        streetNumber: address.streetNumber,
        department: address?.commune,
        region: address?.region,
        apartment: address?.apartment,
        additionalAddressInfo: address?.otherInformation,
        custom: address.coordinates
          ? {
              type: {
                typeId: 'type',
                key: 'adelco-address-type'
              },
              fields: {
                lat: address.coordinates.lat,
                long: address.coordinates.long
              }
            }
          : undefined
      }
    }
  ];
};

export const changeStatusAction = (): BusinessUnitChangeStatusAction[] => {
  return [
    {
      action: 'changeStatus',
      status: 'Active'
    }
  ];
};

export const setChangeNameAction = (name?: string): BusinessUnitChangeNameAction[] => {
  return [
    name
      ? {
          action: 'changeName',
          name: name
        }
      : undefined
  ];
};

export const setCustomFieldAction = (deliveryZoneId: string, tradeName?: string): BusinessUnitSetCustomFieldAction[] => {
  return [
    {
      action: 'setCustomField',
      name: 'deliveryZone',
      value: {
        typeId: 'key-value-document',
        id: deliveryZoneId
      }
    },
    tradeName
      ? {
          action: 'setCustomField',
          name: 'tradeName',
          value: tradeName
        }
      : undefined,
    {
      action: 'setCustomField',
      name: 'customerGroupCode',
      value: '01'
    },
    {
      action: 'setCustomField',
      name: 'shouldApplyT2Rate',
      value: true
    },
    {
      action: 'setCustomField',
      name: 'isCreditEnabled',
      value: false
    },
    {
      action: 'setCustomField',
      name: 'isCreditBlocked',
      value: false
    },
    {
      action: 'setCustomField',
      name: 'taxProfile',
      value: '1'
    }
  ];
};

export const buildSetAssociatesAction = (customerId: string): BusinessUnitSetAssociatesAction[] => {
  return [
    {
      action: 'setAssociates',
      associates: [
        {
          customer: {
            typeId: 'customer',
            id: customerId
          },
          associateRoleAssignments: [{ associateRole: { key: 'admin-role', typeId: 'associate-role' }, inheritance: 'Enabled' }]
        }
      ]
    }
  ];
};
