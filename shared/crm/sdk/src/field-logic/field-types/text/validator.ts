export function validator(value: any, field: any) {
    if(value === '') return true
    return typeof value === 'string';
}
