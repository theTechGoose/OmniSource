import { validator } from './validator';

describe('phone', () => {
  it('should return false if the length of the phone number is not 10', () => {
    const output = validator('123456789', {});
    expect(output).toBe(false);
  })

  it('should return false if the phone number does not match the regex', () => {
    const output = validator('1234567890', {});
    expect(output).toBe(false);
  });

  it('should return true if the phone number is valid', () => {
    const output = validator('(123) 456-7890', {});
    expect(output).toBe(true);
  });
});
