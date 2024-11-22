
export function push<T>(element: T, arr: T[]): T {
  arr.push(element); 
  return element;   
}
