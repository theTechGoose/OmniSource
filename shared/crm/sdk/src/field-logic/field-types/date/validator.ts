export function validator(value: any, field: any)  {
  if(value === '') return ''
  const isDate = value instanceof Date;
  const date = new Date(value);
  const isValidDate = !isNaN(date.getTime());
  return isDate && isValidDate;
}
