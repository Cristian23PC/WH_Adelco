import { convertDeliveryZone } from './delivery-zones.converter';

const deliveryZoneMock = {
  container: 'delivery-zone',
  key: 'bertrand',
  value: {
    label: 'Bertrand',
    t2Rate: '0.16',
    commune: 'chile-chico',
    dcCode: 'PM',
    dcLabel: 'Puerto Montt'
  }
};

const mapIncluding = {
  PM: '12345678'
};

describe('Convert Delivery Zone', () => {
  let converted;
  const expectedConvertedDeliveryZoneResponse = {
    key: 'bertrand',
    label: 'Bertrand',
    dchDefault: '12345678',
    commune: 'chile-chico',
    dcCode: 'PM',
    dcLabel: 'Puerto Montt'
  };

  beforeEach(() => {
    converted = convertDeliveryZone(deliveryZoneMock, mapIncluding);
  });

  it('Should return correct coverted delivery zone', () => {
    expect(converted).toEqual(expectedConvertedDeliveryZoneResponse);
  });
});
