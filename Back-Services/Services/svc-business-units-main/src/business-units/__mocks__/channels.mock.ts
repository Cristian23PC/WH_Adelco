import { Channel } from '@commercetools/platform-sdk';

export const mockChannelTraditional: Partial<Channel> = {
  id: '001eed74-f30a-4be6-9bf2-93af3d1ed35e',
  version: 4,
  createdAt: '2023-03-16T20:57:24.878Z',
  lastModifiedAt: '2023-04-12T12:47:15.799Z',
  key: 'PM_1',
  roles: ['ProductDistribution'],
  name: {
    'es-CL': 'Puerto Montt Tradicionales'
  },
  description: {
    'es-CL': 'Puerto Montt Tradicionales'
  },
  custom: {
    type: {
      typeId: 'type',
      id: '69b016e0-4991-4a61-ad5a-6c4bdfdd651d'
    },
    fields: {
      distributionCenterCode: 'COMPANY_DC',
      customerGroup: 'TRADICIONAL'
    }
  }
};

export const mockChannelSubchannel: Partial<Channel> = {
  id: '221eed74-f30a-4be6-9bf2-93af3d1ed35e',
  version: 4,
  createdAt: '2023-03-16T20:57:24.878Z',
  lastModifiedAt: '2023-04-12T12:47:15.799Z',
  key: 'PM_1',
  roles: ['ProductDistribution'],
  name: {
    'es-CL': 'Puerto Montt Tradicionales'
  },
  description: {
    'es-CL': 'Puerto Montt Tradicionales'
  },
  custom: {
    type: {
      typeId: 'type',
      id: '69b016e0-4991-4a61-ad5a-6c4bdfdd651d'
    },
    fields: {
      distributionCenterCode: 'COMPANY_DC',
      customerGroup: 'INSTITUCIONES',
      salesSubchannel: 'GOBIERNO'
    }
  }
};

export const mockChannelCustomer: Partial<Channel> = {
  id: '991eed74-f30a-4be6-9bf2-93af3d1ed35e',
  version: 4,
  createdAt: '2023-03-16T20:57:24.878Z',
  lastModifiedAt: '2023-04-12T12:47:15.799Z',
  key: 'COMPANY_DC_8',
  roles: ['ProductDistribution'],
  name: {
    'es-CL': 'Puerto Montt Specific'
  },
  description: {
    'es-CL': 'Puerto Montt Specific'
  },
  custom: {
    type: {
      typeId: 'type',
      id: '69b016e0-4991-4a61-ad5a-6c4bdfdd651d'
    },
    fields: {
      distributionCenterCode: 'COMPANY_DC',
      businessPartnerID: 'sap_buid2'
    }
  }
};

export const mockAntofagasta: Partial<Channel> = {
  id: '99999999-f30a-4be6-9bf2-93af3d1ed35e',
  version: 4,
  createdAt: '2023-03-16T20:57:24.878Z',
  lastModifiedAt: '2023-04-12T12:47:15.799Z',
  key: 'AM_1',
  roles: ['ProductDistribution'],
  name: {
    'es-CL': 'AM Tradicionales'
  },
  description: {
    'es-CL': 'AM Tradicionales'
  },
  custom: {
    type: {
      typeId: 'type',
      id: '69b016e0-4991-4a61-ad5a-6c4bdfdd651d'
    },
    fields: {
      distributionCenterCode: 'AM',
      customerGroup: '1'
    }
  }
};
