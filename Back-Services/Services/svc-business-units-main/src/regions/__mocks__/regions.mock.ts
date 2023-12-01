export const mockRegionsResponse = [
  {
    key: 'de-aisen-del-gral-c-ibanez-del-campo',
    value: { label: 'De Aisén del Gral. C. Ibáñez del Campo' }
  },
  {
    key: 'de-antofagasta',
    value: { label: 'De Antofagasta' }
  }
];

export const regionsPagedQueryResponseMock = {
  limit: 500,
  offset: 0,
  count: 2,
  total: 2,
  results: mockRegionsResponse
};
