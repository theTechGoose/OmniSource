export function coorcer(value: any, field: any) {
  const outputValue = Array.isArray(value) ? value : [value];
  return outputValue;
}
