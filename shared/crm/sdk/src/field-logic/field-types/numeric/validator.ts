export function validator(value: any, field: any) {
  if(value === '') return true
  const isNumber = typeof value === 'number';
  return isNumber;
}
