import { NextVisit } from '@/types/BUSalesProfile';
import {
  colors,
  noVisitColor,
  getLegendOptions,
  getListByFilters,
  getColorByGroupCriteria,
  getSalesRepOptions,
  isInCoordinateRange
} from './utils';

describe('Client Map utils', () => {
  const nextVisitsMock: NextVisit[] = [
    {
      daySelector: 'monday',
      frequencyCode: 1,
      time: new Date('2017-09-04').toISOString(),
      bUSalesProfile: {
        id: 192,
        ctId: 'ctid-1',
        name: 'BU-01',
        coordinates: { x: -33.3, y: -70.5 },
        lastOrderDate: '2023-08-15',
        territory: {
          id: 12,
          name: 'Territory-01',
          createdAt: new Date('2017-05-25').toISOString(),
          deletedAt: '',
          updatedAt: '',
          supervisedAreaId: 23,
          salesRep: {
            firstName: 'John',
            lastName: 'Doe',
            username: 'jonhdoe@example.testmail.com',
            role: 'sales-rep',
            status: 'ACTIVE',
            createdAt: new Date('2019-09-04').toISOString(),
            updatedAt: ''
          }
        }
      }
    },
    {
      daySelector: 'wednesday',
      frequencyCode: 3,
      time: new Date('2023-06-09').toISOString(),
      bUSalesProfile: {
        id: 193,
        ctId: 'ctid-2',
        name: 'BU-02',
        coordinates: { x: -70.4, y: -45.5 },
        lastOrderDate: undefined,
        territory: {
          id: 12,
          name: 'Territory-01',
          createdAt: new Date('2017-05-25').toISOString(),
          deletedAt: '',
          updatedAt: '',
          supervisedAreaId: 23,
          salesRep: {
            firstName: 'John',
            lastName: 'Doe',
            username: 'jonhdoe@example.testmail.com',
            role: 'sales-rep',
            status: 'ACTIVE',
            createdAt: new Date('2019-02-23').toISOString(),
            updatedAt: ''
          }
        }
      }
    },
    {
      daySelector: 'thursday',
      frequencyCode: 8,
      time: new Date('2023-06-09').toISOString(),
      bUSalesProfile: {
        id: 193,
        ctId: 'ctid-3',
        name: 'BU-03',
        coordinates: { x: -32.4, y: -67.5 },
        lastOrderDate: new Date().toString(),
        territory: {
          id: 13,
          name: 'Territory-02',
          createdAt: new Date('2017-05-25').toISOString(),
          deletedAt: '',
          updatedAt: '',
          supervisedAreaId: 21,
          salesRep: {
            firstName: 'Michael',
            lastName: 'Smith',
            username: 'michael@example.testmail.com',
            role: 'sales-rep',
            status: 'ACTIVE',
            createdAt: new Date('2019-02-23').toISOString(),
            updatedAt: ''
          }
        }
      }
    },
    {
      daySelector: 'thursday',
      frequencyCode: 2,
      time: new Date('2023-06-09').toISOString(),
      bUSalesProfile: {
        id: 193,
        ctId: 'ctid-4',
        name: 'BU-04',
        coordinates: { x: -31.4, y: -68.5 },
        lastOrderDate: '2023-08-13',
        territory: {
          id: 13,
          name: 'Territory-02',
          createdAt: new Date('2017-05-25').toISOString(),
          deletedAt: '',
          updatedAt: '',
          supervisedAreaId: 21,
          salesRep: {
            firstName: 'Michael',
            lastName: 'Smith',
            username: 'michael@example.testmail.com',
            role: 'sales-rep',
            status: 'ACTIVE',
            createdAt: new Date('2019-02-23').toISOString(),
            updatedAt: ''
          }
        }
      }
    }
  ];
  describe('getLegendOptions', () => {
    it('Should return default legend options', () => {
      const expectedOptions = [
        { color: colors[0], label: 'Todos los clientes' }
      ];
      expect(getLegendOptions(null, false, nextVisitsMock)).toEqual(
        expectedOptions
      );
    });
    it('should return legend options by week days', () => {
      const expectedOptions = [
        { color: colors[0], label: 'Lunes' },
        { color: colors[1], label: 'Martes' },
        { color: colors[2], label: 'Miércoles' },
        { color: colors[3], label: 'Jueves' },
        { color: colors[4], label: 'Viernes' }
      ];
      expect(getLegendOptions('weekly', false, nextVisitsMock)).toEqual(
        expectedOptions
      );
    });
    it('should return legend options by groups', () => {
      const expectedOptions = [
        { color: colors[0], label: 'Semanal' },
        { color: colors[1], label: 'Bisemanal - A' },
        { color: colors[2], label: 'Bisemanal - B' },
        { color: colors[3], label: 'Mensual - A' },
        { color: colors[4], label: 'Mensual - B' },
        { color: colors[5], label: 'Mensual - C' },
        { color: colors[6], label: 'Mensual - D' }
      ];
      expect(getLegendOptions('groups', false, nextVisitsMock)).toEqual(
        expectedOptions
      );
    });
    it('should return legend by with or without recent purchase', () => {
      const expectedOptions = [
        { color: colors[0], label: 'Con compra reciente' },
        { color: colors[1], label: 'Sin compra reciente' }
      ];
      expect(
        getLegendOptions('recent-purchase', false, nextVisitsMock)
      ).toEqual(expectedOptions);
    });
    it('should return legend by territory', () => {
      const expectedOptions = [
        { color: colors[0], label: 'Territory-01' },
        { color: colors[1], label: 'Territory-02' }
      ];
      expect(getLegendOptions('territories', false, nextVisitsMock)).toEqual(
        expectedOptions
      );
    });
    it('should add another option when noVisit is set', () => {
      const expectedOptions = [
        { color: colors[0], label: 'Todos los clientes' },
        { color: noVisitColor, label: 'Sin visita', className: 'mt-3' }
      ];
      expect(getLegendOptions(null, true, nextVisitsMock)).toEqual(
        expectedOptions
      );
    });
  });
  describe('getListByFilters', () => {
    it('should get the list with noVisit set to false', () => {
      const expected = [
        {
          daySelector: 'monday',
          frequencyCode: 1,
          time: new Date('2017-09-04').toISOString(),
          bUSalesProfile: {
            id: 192,
            ctId: 'ctid-1',
            name: 'BU-01',
            coordinates: { x: -33.3, y: -70.5 },
            lastOrderDate: '2023-08-15',
            territory: {
              id: 12,
              name: 'Territory-01',
              createdAt: new Date('2017-05-25').toISOString(),
              deletedAt: '',
              updatedAt: '',
              supervisedAreaId: 23,
              salesRep: {
                firstName: 'John',
                lastName: 'Doe',
                username: 'jonhdoe@example.testmail.com',
                role: 'sales-rep',
                status: 'ACTIVE',
                createdAt: new Date('2019-09-04').toISOString(),
                updatedAt: ''
              }
            }
          }
        },
        {
          daySelector: 'wednesday',
          frequencyCode: 3,
          time: new Date('2023-06-09').toISOString(),
          bUSalesProfile: {
            id: 193,
            ctId: 'ctid-2',
            name: 'BU-02',
            coordinates: { x: -70.4, y: -45.5 },
            lastOrderDate: undefined,
            territory: {
              id: 12,
              name: 'Territory-01',
              createdAt: new Date('2017-05-25').toISOString(),
              deletedAt: '',
              updatedAt: '',
              supervisedAreaId: 23,
              salesRep: {
                firstName: 'John',
                lastName: 'Doe',
                username: 'jonhdoe@example.testmail.com',
                role: 'sales-rep',
                status: 'ACTIVE',
                createdAt: new Date('2019-02-23').toISOString(),
                updatedAt: ''
              }
            }
          }
        },
        {
          daySelector: 'thursday',
          frequencyCode: 8,
          time: new Date('2023-06-09').toISOString(),
          bUSalesProfile: {
            id: 193,
            ctId: 'ctid-3',
            name: 'BU-03',
            coordinates: { x: -32.4, y: -67.5 },
            lastOrderDate: new Date().toString(),
            territory: {
              id: 13,
              name: 'Territory-02',
              createdAt: new Date('2017-05-25').toISOString(),
              deletedAt: '',
              updatedAt: '',
              supervisedAreaId: 21,
              salesRep: {
                firstName: 'Michael',
                lastName: 'Smith',
                username: 'michael@example.testmail.com',
                role: 'sales-rep',
                status: 'ACTIVE',
                createdAt: new Date('2019-02-23').toISOString(),
                updatedAt: ''
              }
            }
          }
        }
      ];
      expect(getListByFilters(nextVisitsMock, null, false)).toEqual(expected);
    });
    it('should get the list filtered by sales rep and noVisit at true', () => {
      const expected = [
        {
          daySelector: 'monday',
          frequencyCode: 1,
          time: new Date('2017-09-04').toISOString(),
          bUSalesProfile: {
            id: 192,
            ctId: 'ctid-1',
            name: 'BU-01',
            coordinates: { x: -33.3, y: -70.5 },
            lastOrderDate: '2023-08-15',
            territory: {
              id: 12,
              name: 'Territory-01',
              createdAt: new Date('2017-05-25').toISOString(),
              deletedAt: '',
              updatedAt: '',
              supervisedAreaId: 23,
              salesRep: {
                firstName: 'John',
                lastName: 'Doe',
                username: 'jonhdoe@example.testmail.com',
                role: 'sales-rep',
                status: 'ACTIVE',
                createdAt: new Date('2019-09-04').toISOString(),
                updatedAt: ''
              }
            }
          }
        },
        {
          daySelector: 'wednesday',
          frequencyCode: 3,
          time: new Date('2023-06-09').toISOString(),
          bUSalesProfile: {
            id: 193,
            ctId: 'ctid-2',
            name: 'BU-02',
            coordinates: { x: -70.4, y: -45.5 },
            lastOrderDate: undefined,
            territory: {
              id: 12,
              name: 'Territory-01',
              createdAt: new Date('2017-05-25').toISOString(),
              deletedAt: '',
              updatedAt: '',
              supervisedAreaId: 23,
              salesRep: {
                firstName: 'John',
                lastName: 'Doe',
                username: 'jonhdoe@example.testmail.com',
                role: 'sales-rep',
                status: 'ACTIVE',
                createdAt: new Date('2019-02-23').toISOString(),
                updatedAt: ''
              }
            }
          }
        }
      ];
      expect(
        getListByFilters(
          nextVisitsMock,
          ['jonhdoe@example.testmail.com'],
          false
        )
      ).toEqual(expected);
    });
    it('should get the list filtered by sales rep and noVisit at false', () => {
      const expected = [
        {
          daySelector: 'thursday',
          frequencyCode: 8,
          time: new Date('2023-06-09').toISOString(),
          bUSalesProfile: {
            id: 193,
            ctId: 'ctid-3',
            name: 'BU-03',
            coordinates: { x: -32.4, y: -67.5 },
            lastOrderDate: new Date().toString(),
            territory: {
              id: 13,
              name: 'Territory-02',
              createdAt: new Date('2017-05-25').toISOString(),
              deletedAt: '',
              updatedAt: '',
              supervisedAreaId: 21,
              salesRep: {
                firstName: 'Michael',
                lastName: 'Smith',
                username: 'michael@example.testmail.com',
                role: 'sales-rep',
                status: 'ACTIVE',
                createdAt: new Date('2019-02-23').toISOString(),
                updatedAt: ''
              }
            }
          }
        }
      ];
      expect(
        getListByFilters(
          nextVisitsMock,
          ['michael@example.testmail.com'],
          false
        )
      ).toEqual(expected);
    });
  });
  describe('getColorByGroupCriteria', () => {
    it('should return colors by week day', () => {
      const options = getLegendOptions('weekly', true, nextVisitsMock);
      expect(
        getColorByGroupCriteria('weekly', nextVisitsMock[0], options)
      ).toEqual(colors[0]);
      expect(
        getColorByGroupCriteria('weekly', nextVisitsMock[1], options)
      ).toEqual(colors[2]);
      expect(
        getColorByGroupCriteria('weekly', nextVisitsMock[2], options)
      ).toEqual(colors[3]);
      expect(
        getColorByGroupCriteria('weekly', nextVisitsMock[3], options)
      ).toEqual(noVisitColor);
    });
    it('should return colors by group', () => {
      const options = getLegendOptions('groups', true, nextVisitsMock);
      expect(
        getColorByGroupCriteria('groups', nextVisitsMock[0], options)
      ).toEqual(colors[0]);
      expect(
        getColorByGroupCriteria('groups', nextVisitsMock[1], options)
      ).toEqual(colors[1]);
      expect(
        getColorByGroupCriteria('groups', nextVisitsMock[2], options)
      ).toEqual(colors[3]);
      expect(
        getColorByGroupCriteria('groups', nextVisitsMock[3], options)
      ).toEqual(noVisitColor);
    });
    it('should return colors by with or without recent purchase', () => {
      const options = getLegendOptions('recent-purchase', true, nextVisitsMock);
      expect(
        getColorByGroupCriteria('recent-purchase', nextVisitsMock[0], options)
      ).toEqual(colors[1]);
      expect(
        getColorByGroupCriteria('recent-purchase', nextVisitsMock[1], options)
      ).toEqual(colors[1]);
      expect(
        getColorByGroupCriteria('recent-purchase', nextVisitsMock[2], options)
      ).toEqual(colors[0]);
      expect(
        getColorByGroupCriteria('recent-purchase', nextVisitsMock[3], options)
      ).toEqual(noVisitColor);
    });
    it('should returns colors by territories', () => {
      const options = getLegendOptions('territories', true, nextVisitsMock);
      expect(
        getColorByGroupCriteria('territories', nextVisitsMock[0], options)
      ).toEqual(colors[0]);
      expect(
        getColorByGroupCriteria('territories', nextVisitsMock[1], options)
      ).toEqual(colors[0]);
      expect(
        getColorByGroupCriteria('territories', nextVisitsMock[2], options)
      ).toEqual(colors[1]);
      expect(
        getColorByGroupCriteria('territories', nextVisitsMock[3], options)
      ).toEqual(noVisitColor);
    });
  });
  describe('getSalesRepOptions', () => {
    it('should return expected options', () => {
      const expected = [
        { label: 'John Doe', value: 'jonhdoe@example.testmail.com' },
        { label: 'Michael Smith', value: 'michael@example.testmail.com' }
      ];

      expect(getSalesRepOptions(nextVisitsMock)).toEqual(expected);
    });
  });
  describe('isInCoordinateRange', () => {
    it('Should return false', () => {
      const { coordinates } = nextVisitsMock[1].bUSalesProfile;
      expect(isInCoordinateRange(coordinates)).toBe(false);
      expect(isInCoordinateRange(undefined)).toBe(false);
    });
    it('Should return true', () => {
      const { coordinates } = nextVisitsMock[0].bUSalesProfile;
      expect(isInCoordinateRange(coordinates)).toBe(true);
    });
  });
});
