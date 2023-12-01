export const mockDeliveryZoneValue = {
  label: 'Label',
  t2Rate: '0.1',
  dcCode: 'dc',
  deliveryZoneCode: 'H013',
  regionCode: '08',
  commune: 'antuco',
  defaultSalesBranch: '100',
  dcLabel: 'Sur Medio',
  method: 'Delivery',
  cutoffTime: ['23:59'],
  deliveryDays: [5],
  deliveryRange: 0,
  preparationTime: 2,
  frequency: 'W',
  isAvailable: true
};

export const mockDeliveryZonesResponse = {
  id: 'id',
  container: 'container',
  key: 'key',
  value: {
    ...mockDeliveryZoneValue
  }
};
