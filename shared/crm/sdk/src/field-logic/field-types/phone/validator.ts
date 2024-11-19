export function validator(value: any, field: any) {
  const isString = typeof value === 'string';
  if(!isString) return false
  const hasCorrectLength = value.replace(/\D/g, '').length === 10;
  const regex = /\(\d{3}\) \d{3}-\d{4}/;
  const passesRegex = regex.test(value);
  return  hasCorrectLength && passesRegex;
}

