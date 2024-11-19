import { validator } from './validator';

describe('numeric', () => {
  it('should return true if the value is a number', () => {
    const output = validator(123, {});
    expect(output).toBe(true);
  });

  it('should return false if the value is not a number', () => {
    const output = validator('123', {});
    expect(output).toBe(false);
  })
});
