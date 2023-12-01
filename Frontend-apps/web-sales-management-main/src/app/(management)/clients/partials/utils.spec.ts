import { Role } from '@/types/User';
import { getTerritoryLabel, getDefaultTerritoryOptions } from './utils';

describe('utils functions', () => {
  const buMock = {
    id: 1,
    name: 'negocio 1',
    customerName: 'Customer 1',
    channel: 'Channel 1',
    address: 'Address 1',
    zoneManagerName: 'Manager 1',
    supervisorName: 'Supervisor 1',
    salesRepName: 'John Doe',
    territoryName: 'Territory 1'
  };
  describe('get label', () => {
    it('should return correct string', () => {
      expect(getTerritoryLabel(buMock)).toEqual('John Doe / Territory 1');
    });
    describe('get default option', () => {
      it('should return empty array', () => {
        expect(getDefaultTerritoryOptions()).toEqual([]);
      });
      it('should return an array with correct option', () => {
        expect(getDefaultTerritoryOptions(buMock)).toEqual([
          { label: 'John Doe / Territory 1', value: '-' }
        ]);
      });
    });
  });
});
