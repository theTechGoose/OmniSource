import url from 'node:url';
import path from 'node:path';

export const WRITE_FILE_PATH = path.join(url.fileURLToPath(import.meta.url), '..', 'dist')

export const NON_WRITEABLE_FIELDS = [
    'address',
    'dblink',
    'lookup',
    'formula',
    'multitext',
  ]

export const CHARACTER_REPLACEMENTS: { [key: string]: string } = {
    // Numbers
    '0': 'zero',
    '1': 'one',
    '2': 'two',
    '3': 'three',
    '4': 'four',
    '5': 'five',
    '6': 'six',
    '7': 'seven',
    '8': 'eight',
    '9': 'nine',

    // Common symbols
    '#': 'hash',
    '$': 'dollar',
    '%': 'percent',
    '&': 'and',
    '*': 'star',
    '@': 'at',
    '!': 'exclamation',
    '?': 'question',
    '+': 'plus',
    '-': 'dash',
    '=': 'equals',
    '/': 'slash',
    '\\': 'backslash',
    '^': 'caret',
    '~': 'tilde',
    '`': 'backtick',
    '|': 'pipe',
    ':': 'colon',
    ';': 'semicolon',
    ',': 'comma',
    '.': 'dot',
    '<': 'lessThan',
    '>': 'greaterThan',

    // Parentheses and brackets
    '(': 'leftParen',
    ')': 'rightParen',
    '[': 'leftBracket',
    ']': 'rightBracket',
    '{': 'leftBrace',
    '}': 'rightBrace',

    // Quotation marks
    '"': 'doubleQuote',
    "'": 'singleQuote',

    // Mathematical symbols
    '∆': 'delta',
    '∑': 'sum',
    'π': 'pi',

    // Extended currency symbols
    '€': 'euro',
    '£': 'pound',
    '¥': 'yen',
    '¢': 'cent',

    // Accented characters (representative set, can be extended)
    'á': 'a',
    'é': 'e',
    'í': 'i',
    'ó': 'o',
    'ú': 'u',
    'ñ': 'n',

    // Emoji (a small sample for demonstration; can be expanded as needed)
    '😊': 'smile',
    '🚀': 'rocket',
    '❤️': 'heart',

    // Miscellaneous
    '_': '_',
    ' ': '',
};

