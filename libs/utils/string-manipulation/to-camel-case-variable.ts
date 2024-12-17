export function toCamelCaseVariableName(input: string): string {
  // Define delimiters as a list
  const delimiters = [' ', ',', ';', ':', '-', '_', '.', '/'];

  // Step 1: Remove invalid characters and split words
  const words = input
    .split('')
    .map(char => (delimiters.includes(char) ? ' ' : char)) // Replace delimiters with spaces
    .join('')
    .replace(/[^a-zA-Z0-9 ]+/g, '') // Remove non-alphanumeric characters except spaces
    .trim()                         // Remove leading/trailing spaces
    .split(/\s+/);                 // Split into words by spaces

  if (words.length === 0) {
    throw new Error('Input string does not contain valid characters.');
  }

  // Step 2: Ensure the variable starts with a valid letter and format as camelCase
  let camelCased = words
    .map((word, index) => {
      const lower = word.toLowerCase();
      return index === 0
        ? lower.replace(/^[^a-zA-Z]+/, '') // Ensure the first word starts with a valid letter
        : lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join('');

  // Step 3: Adjust first character if it's invalid
  if (!/^[a-zA-Z_$]/.test(camelCased.charAt(0))) {
    camelCased = camelCased.replace(/^[^a-zA-Z_$]+/, ''); // Remove invalid leading characters
  }

  // If still invalid, prepend an underscore
  if (!/^[a-zA-Z_$]/.test(camelCased.charAt(0))) {
    camelCased = `_${camelCased}`;
  }

  return camelCased;
}
