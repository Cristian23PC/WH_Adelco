import { BusinessUnit } from '@commercetools/platform-sdk';
import { convertBusinessUnit } from '.';
import { mockCompanyBusinessUnit } from '../__mocks__/business-units.mock';

const expectedConvertedBusinessUnit = {
  ...mockCompanyBusinessUnit,
  deliveryZoneKey: mockCompanyBusinessUnit?.custom?.fields?.deliveryZone?.obj?.key,
  rut: mockCompanyBusinessUnit.custom?.fields.rut,
  custom: undefined,
  distributionCenter: 'COMPANY_DC',
  tradeName: 'tradeName',
  customerGroupCode: 'TRADICIONAL',
  t2Rate: '0.12',
  creditLimit: 1000,
  creditExcessTolerance: 500,
  isCreditBlocked: true,
  isCreditEnabled: true,
  creditTermDays: 30
};

describe('Convert Business Unit', () => {
  let convertedBusinessUnit;

  describe('Convert with distribution channel ID', () => {
    beforeEach(() => {
      convertedBusinessUnit = convertBusinessUnit(mockCompanyBusinessUnit as BusinessUnit, 'dcChannelId');
    });

    it('Should return correct coverted business unit', () => {
      expect(convertedBusinessUnit).toEqual({
        ...expectedConvertedBusinessUnit,
        distributionChannelId: 'dcChannelId',
        taxProfile: '1',
        shouldApplyT2Rate: true,
        externalId: 'sap_buid',
        isCreditBlocked: true,
        isCreditEnabled: true,
        creditLimit: 1000,
        creditExcessTolerance: 500,
        tradeName: undefined
      });
    });

    describe('Convert without channel ID', () => {
      beforeEach(() => {
        convertedBusinessUnit = convertBusinessUnit(mockCompanyBusinessUnit as BusinessUnit, undefined);
      });

      it('Should return correct coverted business unit', () => {
        expect(convertedBusinessUnit).toEqual({
          ...expectedConvertedBusinessUnit,
          distributionChannelId: undefined,
          taxProfile: '1',
          shouldApplyT2Rate: true,
          externalId: 'sap_buid',
          isCreditBlocked: true,
          isCreditEnabled: true,
          creditLimit: 1000,
          creditExcessTolerance: 500,
          tradeName: undefined
        });
      });
    });
  });
});
