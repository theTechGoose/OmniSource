import {  validator } from './validator';
function getMockField(allowNewChoices: boolean) {
  return {
    properties: {
      allowNewChoices,
      choices: ['one', 'two', 'three'],
    },
  };
}

describe('multi-text', () => {
  it('should validate that all values are strings', () => {
    const mockField = getMockField(true);
    const output = validator('one', mockField)
    expect(output).toBe(true);
  });

  it('should fail on a number being passed in', () => {
    const mockField = getMockField(true);
    const output = validator(1, mockField)
    expect(output).toBe(false);
  })

  it('should also accept an array', () => {
    const mockField = getMockField(true);
    const output = validator(['one', 'two'], mockField)
    expect(output).toBe(true);
  })

  it('should fail if any value is not a string', () => {
    const mockField = getMockField(true);
    const output = validator(['one', 2], mockField)
    expect(output).toBe(false);
  })

  it('should fail if any value is not in the choices array', () => {
    const mockField = getMockField(false);
    const output = validator(['one', 'four'], mockField)
    expect(output).toBe(false);
  });

  it('should pass if all values are in the choices array', () => {
    const mockField = getMockField(false);
    const output = validator(['one', 'two'], mockField)
    expect(output).toBe(true);
  });
});
