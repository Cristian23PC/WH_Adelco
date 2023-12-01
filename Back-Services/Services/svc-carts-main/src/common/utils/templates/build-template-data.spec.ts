import { mockAdelcoCartResponse } from '@/carts/__mock__/carts.mock';
import { buildTemplateData } from './build-template-data';
import { OrderContactRequestDto } from '@/carts/dto/orderContactRequest';
import { mockAdelcoLineItem } from './build-template-data.mock';

jest.useFakeTimers().setSystemTime(new Date('2024-01-01'));

describe('build-template-data', () => {
  describe('buildTemplateData', () => {
    describe('when send the full orderContactRequest and Adelco Cart', () => {
      it('should return template data', () => {
        const orderContactRequest: OrderContactRequestDto = {
          username: 'email@email.com',
          rut: 'rut',
          firstName: 'firstName',
          lastName: 'lastName',
          phone: 'phone',
          address: {
            country: 'CL',
            region: 'region',
            commune: 'commune',
            city: 'city',
            streetName: 'streetName',
            streetNumber: 'streetNumber',
            apartment: 'apartment',
            otherInformation: 'otherInformation',
            coordinates: { lat: 1, long: 1 }
          },
          billingAddress: {
            country: 'CL',
            region: 'region',
            commune: 'commune',
            city: 'city',
            streetName: 'streetName',
            streetNumber: 'streetNumber',
            apartment: 'apartment',
            otherInformation: 'otherInformation',
            coordinates: { lat: 1, long: 1 }
          }
        };
        expect(buildTemplateData({ ...mockAdelcoCartResponse, lineItems: mockAdelcoLineItem }, orderContactRequest, 'buKey')).toEqual({
          cartId: 'c3d864a1-577c-4a11-bd94-d32f8bc5ff2b',
          client: {
            buKey: 'buKey',
            commune: 'commune',
            email: 'email@email.com',
            name: 'firstName lastName',
            phone: 'phone',
            region: 'region',
            rut: 'rut',
            streetName: 'streetName',
            streetNumber: 'streetNumber'
          },
          billingAddress: {
            commune: 'commune',
            region: 'region',
            streetName: 'streetName',
            streetNumber: 'streetNumber'
          },
          discounts: '$0',
          items: [
            {
              image: 'https://8af79c1a06408d51955d-9a10b61716dda30af65ea3554b99e550.ssl.cf1.rackcdn.com/img-QvKP64GP.png',
              productName: 'PROTECTOR SOLAR CREMA SPF50+PANTALLA SIMONDS 1 kg',
              quantity: '1/CAJA',
              sku: '161187',
              totalPrice: '$69.855',
              unitPrice: '$69.855/CAJA'
            }
          ],
          requestDate: '2023-12-31',
          requestTime: '21:00:00',
          subTotal: '$0',
          taxes: '$0',
          totalAmount: '$0'
        });
      });
    });

    describe('when send the minimum of orderContactRequest and Adelco Cart', () => {
      it('should return template data with the minimum', () => {
        const orderContactRequest: OrderContactRequestDto = {
          username: 'email@email.com',
          rut: 'rut',
          address: {
            country: 'CL',
            region: 'region',
            commune: 'commune',
            city: 'city',
            streetName: 'streetName'
          },
          billingAddress: {
            country: 'CL',
            region: 'region',
            commune: 'commune',
            city: 'city',
            streetName: 'streetName'
          }
        };
        expect(buildTemplateData(mockAdelcoCartResponse, orderContactRequest, 'buKey')).toEqual({
          cartId: 'c3d864a1-577c-4a11-bd94-d32f8bc5ff2b',
          client: {
            buKey: 'buKey',
            commune: 'commune',
            email: 'email@email.com',
            name: 'n/a',
            phone: 'n/a',
            region: 'region',
            rut: 'rut',
            streetName: 'streetName',
            streetNumber: 'n/a'
          },
          billingAddress: {
            commune: 'commune',
            region: 'region',
            streetName: 'streetName',
            streetNumber: 'n/a'
          },
          discounts: '$0',
          items: [],
          requestDate: '2023-12-31',
          requestTime: '21:00:00',
          subTotal: '$0',
          taxes: '$0',
          totalAmount: '$0'
        });
      });
    });
  });
});
