import { formatCapitalizeText, formatOption, labelizeText } from './common';

describe('formatCapitalizeText', () => {
  it('should capitalize the first letter of a string', () => {
    const input = 'hello world';
    const expectedOutput = 'Hello world';

    const result = formatCapitalizeText(input);

    expect(result).toBe(expectedOutput);
  });

  it('should handle an empty string', () => {
    const input = '';
    const expectedOutput = '';

    const result = formatCapitalizeText(input);

    expect(result).toBe(expectedOutput);
  });

  it('should handle a string with only one character', () => {
    const input = 'a';
    const expectedOutput = 'A';

    const result = formatCapitalizeText(input);

    expect(result).toBe(expectedOutput);
  });
});

describe('formatOption', () => {
  it('should format an option object correctly', () => {
    const input = { key: 'optionKey', label: 'Option Label' };
    const expectedOutput = { value: 'optionKey', label: 'Option Label' };

    const result = formatOption(input);

    expect(result).toEqual(expectedOutput);
  });
});

describe('labelizeText', () => {
  it('should format a hyphen-separated string correctly', () => {
    const input = 'hello-world';
    const expectedOutput = 'Hello World';

    const result = labelizeText(input);

    expect(result).toBe(expectedOutput);
  });

  it('should handle a string with leading/trailing spaces', () => {
    const input = '  hello-world  ';
    const expectedOutput = 'Hello World';

    const result = labelizeText(input);

    expect(result).toBe(expectedOutput);
  });

  it('should handle an empty string', () => {
    const input = '';
    const expectedOutput = '';

    const result = labelizeText(input);

    expect(result).toBe(expectedOutput);
  });
});
