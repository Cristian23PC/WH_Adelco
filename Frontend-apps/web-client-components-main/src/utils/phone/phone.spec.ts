import { splitPrefix, formatPhone, postFormatPhone } from './phone';

describe('phone utils', () => {
  describe('splitPrefix', () => {
    it('should split the prefix and number when phone is in the Chile format', () => {
      const phone = '56123123123';
      const result = splitPrefix(phone);
      expect(result).toEqual(['56', '123123123']);
    });

    it('should return null as prefix and the original phone number when phone does match with prefix', () => {
      const phone = '123123123';
      const result = splitPrefix(phone);
      expect(result).toEqual([undefined, '123123123']);
    });

    it('should return null as prefix and an empty string when phone is an empty string', () => {
      const result = splitPrefix();
      expect(result).toEqual([undefined, '']);
    });
  });

  describe('formatPhoneNumber', () => {
    it('should format phone number without spaces', () => {
      const phoneNumberInput = '123456789';
      const formattedPhoneNumber = formatPhone(phoneNumberInput);
      expect(formattedPhoneNumber).toBe('1 2345 6789');
    });

    it('should format phone number with spaces', () => {
      const phoneNumberInput = '12 3456 789';
      const formattedPhoneNumber = formatPhone(phoneNumberInput);
      expect(formattedPhoneNumber).toBe('1 2345 6789');
    });

    it('should return empty string if there is no value', () => {
      const formattedPhoneNumber = formatPhone();
      expect(formattedPhoneNumber).toBe('');
    });
  });

  describe('postFormatPhone', () => {
    it('should format phone correctly', () => {
      expect(postFormatPhone('56', '1 2345 6789')).toBe('56123456789');
    });
  });
});
