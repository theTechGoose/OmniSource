export function coorcer(value: any, field: any) {
  const stringified =  value?.toString()
  if(!!stringified) return stringified
  return value
}
