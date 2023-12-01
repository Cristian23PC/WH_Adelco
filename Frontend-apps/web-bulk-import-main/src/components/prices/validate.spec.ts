import { validate } from './validate';
import { IPrices } from './interfaces/prices';

describe('validate', () => {
  it('should return errors with distributionChannel required message when distributionChannel is missing', () => {
    // Arrange
    const values: Partial<IPrices> = {};

    // Act
    const errors = validate(values);

    // Assert
    expect(errors.distributionChannel).toBe('Campo requerido');
  });

  it('should not return errors when distributionChannel is present', () => {
    // Arrange
    const values: Partial<IPrices> = {
      distributionChannel: 'channel1',
    };

    // Act
    const errors = validate(values);

    // Assert
    expect(errors.distributionChannel).toBeUndefined();
  });
});
