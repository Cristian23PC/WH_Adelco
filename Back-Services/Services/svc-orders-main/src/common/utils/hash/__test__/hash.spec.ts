import { Hash } from '../hash';
import * as bcrypt from 'bcrypt';

describe('Hash', () => {
  const plainText = 'password';

  describe('make()', () => {
    it('should hash the plain text password', () => {
      const hash = Hash.make(plainText);

      expect(bcrypt.compareSync(plainText, hash)).toBe(true);
    });
  });

  describe('compare()', () => {
    it('should compare the plain text password with the hash', () => {
      const hash = Hash.make(plainText);
      const isValid = Hash.compare(plainText, hash);

      expect(isValid).toBe(true);
    });
  });

  it('should return false if the plain text password does not match the hash', () => {
    const hash = Hash.make(plainText);
    const isValid = Hash.compare('wrong-password', hash);

    expect(isValid).toBe(false);
  });
});
