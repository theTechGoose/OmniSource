function formatPhoneNumber(phoneNumber: string) {
  if (phoneNumber.length !== 10) return phoneNumber
  const areaCode = phoneNumber.slice(0, 3);
  const centralOfficeCode = phoneNumber.slice(3, 6);
  const lineNumber = phoneNumber.slice(6, 10);

  return `(${areaCode}) ${centralOfficeCode}-${lineNumber}`;
}

export function coorcer(value: any, field: any) {
  if (typeof value !== 'string') return;
  const strippedNumber = value.split(/\D/).join('');
  const cleanNumber =
    strippedNumber.charAt(0) === '1' ? strippedNumber.slice(1) : strippedNumber;
  return formatPhoneNumber(cleanNumber);
}
