const coorceMap = {
  'yes': true,
  'no': false,
  'true': true,
  'false': false,
  'True': true,
  'False': false,
  'TRUE': true,
  'FALSE': false,
  '1': true,
} as any


export function coorcer(value: any) {
  if(value === true) return value
  if(value === false) return value
  const coercedValue = coorceMap[value]
  if(coercedValue === undefined) return value
  return coercedValue

}


