export function camelToKebabCase(input: string): string {
    return input
        .replace(/([a-z0-9])([A-Z])/g, "$1-$2") // Add a dash between lower and upper case letters
        .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2") // Handle consecutive upper case letters
        .toLowerCase(); // Convert the result to lower case
}
