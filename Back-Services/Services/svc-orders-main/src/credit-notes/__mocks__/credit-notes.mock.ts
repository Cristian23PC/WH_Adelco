import { CustomObject } from '@commercetools/platform-sdk';

export const creditNotesMock: CustomObject = {
  id: '71b91470-86bb-41fc-9b88-3acdf0ccf2cf',
  version: 2,
  createdAt: '2023-03-15T18:20:09.377Z',
  lastModifiedAt: '2023-03-15T18:20:09.377Z',
  container: 'credit-notes',
  key: 'key',
  value: {
    documentId: 'documentId',
    dteNumber: 'dteNumber',
    dteType: 'NTC',
    state: 'Issued',
    grossAmount: {
      centAmount: 1234,
      currency: 'CLP'
    }
  }
};
