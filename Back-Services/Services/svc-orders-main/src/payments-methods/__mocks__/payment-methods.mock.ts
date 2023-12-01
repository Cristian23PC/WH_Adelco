import { CustomObject } from '@commercetools/platform-sdk';

export const mockPaymentMethodsResponse: CustomObject = {
  id: 'id',
  version: 1,
  createdAt: '2023-07-13T19:03:58.727Z',
  lastModifiedAt: '2023-07-14T12:51:07.989Z',
  container: 'payment-method',
  key: 'Cash',
  value: {
    enabled: true,
    description: 'Efectivo',
    dependsOnCreditLineStatus: false,
    displayAsPaymentOption: true,
    sapMethod: 'E',
    sapConditions: {
      '0': 'ZD01'
    }
  }
};
