import { BusinessUnit, DivisionDraft } from '@commercetools/platform-sdk';
import { divisionRequest, mockCustomerDraft, mockDivisionDraft, mockBusinessUnitCompanyDraftWithUpdatedRUT } from './__mocks__/parser.mock';
import * as parser from './parser';
import { mockCompanyBusinessUnit } from '@/business-units/__mocks__/business-units.mock';

jest.useFakeTimers().setSystemTime(new Date('2023-07-21'));

describe('Parser utils', () => {
  describe('generateVerificationCodeData', () => {
    it('should generate a verification code and encode in base64', () => {
      expect(typeof parser.generateVerificationCodeData()).toBe('string');
    });
  });

  describe('buildCustomerAddress', () => {
    it('should build an Address and set default country', () => {
      expect(parser.buildCustomerAddress('11111111111')).toEqual({ country: 'CL', phone: '11111111111' });
    });

    it('should build an Address', () => {
      expect(parser.buildCustomerAddress('11111111111', 'AR')).toEqual({ country: 'AR', phone: '11111111111' });
    });
  });

  describe('buildCustomerDraft', () => {
    beforeAll(() => {
      jest.spyOn(parser, 'buildCustomerAddress').mockImplementation(() => ({ country: 'CL', phone: '11111111111' }));
    });

    it('should build CustomerDraft', () => {
      expect(parser.buildCustomerDraft({ firstName: 'firstName', lastName: 'lastName', phone: '11111111111', email: 'example@email.com' })).toEqual(mockCustomerDraft);
    });
  });

  describe('buildBusinessUnitDraft', () => {
    it('should return a CompanyDraft', () => {
      expect(parser.buildBusinessUnitDraft('600001', { rut: 'ru-T', tradeName: 'trade-name' }, undefined, 'customer-id', 'delivery-zone-id')).toEqual(
        mockBusinessUnitCompanyDraftWithUpdatedRUT
      );
    });
    it('should return a CompanyDraft with name', () => {
      expect(parser.buildBusinessUnitDraft('600001', { rut: 'ru-T', tradeName: 'trade-name' }, 'company-name', 'customer-id', 'delivery-zone-id')).toEqual({
        ...mockBusinessUnitCompanyDraftWithUpdatedRUT,
        name: 'company-name'
      });
    });
  });

  describe('getVerificationCode', () => {
    it('should return code and epochTime', () => {
      const verificationCodeData = 'MDMyNF8xNjg3Mjc3Mzg4';
      const { verificationCode, epochTime } = parser.getVerificationCode(verificationCodeData);

      expect(verificationCode).toBe('0324');
      expect(epochTime).toBe(1687277388);
    });
  });

  describe('buildDivisionDraft', () => {
    const parentBusinessUnit: BusinessUnit = mockCompanyBusinessUnit as BusinessUnit;

    const deliveryZoneId = 'delivery-zone-id';

    it('should build a DivisionDraft', () => {
      expect(parser.buildDivisionDraft('600001', 'customerId', { parentBusinessUnit, division: divisionRequest, deliveryZoneId })).toEqual(mockDivisionDraft);
    });

    it('should build a DivisionDraft with no billing address', () => {
      const expectedDivision: DivisionDraft = { ...mockDivisionDraft, addresses: [mockDivisionDraft.addresses[0]], defaultBillingAddress: 0 };
      expect(parser.buildDivisionDraft('600001', 'customerId', { parentBusinessUnit, division: { ...divisionRequest, billingAddress: null }, deliveryZoneId })).toEqual(
        expectedDivision
      );
    });

    it('should build a DivisionDraft with division name', () => {
      expect(parser.buildDivisionDraft('600001', 'customerId', { parentBusinessUnit, division: divisionRequest, divisionName: 'division-name', deliveryZoneId })).toEqual({
        ...mockDivisionDraft,
        name: 'division-name'
      });
    });
  });
});
