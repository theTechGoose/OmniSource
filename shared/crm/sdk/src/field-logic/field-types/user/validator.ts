export function validator(value: any, field: any): boolean {
  const id = value?.id;
  return !!id
}
