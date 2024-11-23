/**
 * This function is array.push but it returns the pushed element
 * @param element - the element to push
 * @param arr - the array to push to
 */
export function push<T>(element: T, arr: T[]): T {
  arr.push(element);
  return element;
}



