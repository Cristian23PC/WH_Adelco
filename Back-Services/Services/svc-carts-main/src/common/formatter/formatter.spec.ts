import { formatRut } from './formatter';

describe('formatter', () => {
  describe('formatRut', () => {
    it('should format rut correctly putting -', () => {
      expect(formatRut('651148634')).toEqual('65114863-4');
    });

    describe('when send rut with -', () => {
      it('should return rut', () => {
        expect(formatRut('65114863-4')).toEqual('65114863-4');
      });
    });
  });
});
