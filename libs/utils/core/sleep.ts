/**
  * Wait for a specified amount of time
  * @param {number} ms - The number of milliseconds to wait.
  **/
export function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}
