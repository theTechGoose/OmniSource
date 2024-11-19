import { validator } from './validator';

describe('date', () => {
  it('should return false if the validator is invalid', () => {
    const output = validator(new Date('foo'), {});
    expect(output).toBe(false);
  });

  it('should return false if the validator is not a date', () => {
    const output = validator('foo', {});
    expect(output).toBe(false);
  });

  it('should return false if the validator is not an instance of a date', () => {
    const output = validator('2021-01-01', {});
    expect(output).toBe(true);
  });
});
