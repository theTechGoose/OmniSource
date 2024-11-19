import { format } from 'date-fns';

export function formatter(value: any, field: any) {
  if(value === '') return ''
  return format(value, 'yyyy-MM-dd')
}
