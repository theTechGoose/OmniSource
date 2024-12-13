
/**
 * Throw an error with the given message.
 * @param msg The message to throw.
 */
export function thrw(msg: string): never {
  throw new Error(msg);
}
