import { CustomObject } from '@commercetools/platform-sdk';

export const mockSequenceResponse: CustomObject = {
  id: '4cce8407-792d-447e-8d68-ded7fcdaeace',
  version: 5,
  createdAt: '2023-07-13T19:03:58.727Z',
  lastModifiedAt: '2023-07-14T12:51:07.989Z',
  container: 'sequence',
  key: 'orderNumber',
  value: 600000
};

export const mockNewSequenceResponse: CustomObject = { ...mockSequenceResponse, value: mockSequenceResponse.value + 1 };
