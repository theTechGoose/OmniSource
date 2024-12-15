
 export function pad(value: string | number, length: number = 6, padChar = '0'): string {
    const str = value.toString(); // Convert number to string
    return str.length > length ? str.slice(0, length) : str.padStart(length, padChar);
}

