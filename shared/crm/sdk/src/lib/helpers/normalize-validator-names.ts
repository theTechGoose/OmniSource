
export function normalizeValidatorNames(input: string): string {
    const output = input.replace(/([A-Z])/g, (match) => `-${match.toLowerCase()}`).split('-').join('');
    return output;
}

export function normalizeAllValidatorNames(validatorObj: any) {
  return Object.entries(validatorObj).reduce((acc, [key, value]) => {
    acc[normalizeValidatorNames(key)] = value;
    return acc;
  }, {} as any)
}
