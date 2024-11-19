export function formatter(value: Date | string, field: any) {
  if(typeof value === 'string') return ''
  return value.toISOString();
}
