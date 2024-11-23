import { thrw } from "@core";

/**
 * Check if the given object has all the properties in the given list.
 * @param obj The object to check.
 * @param props The list of properties to check for.
 * @returns True if the object has all the properties, false otherwise.
 */
export function chkProps(obj: any, ...props: Array<string>): boolean {
  const propChecker = new PropChecker(obj);
  propChecker.checkIfTruthy();
  propChecker.checkIfObject()
  return props.every(propChecker.check);
}

/**
  * A class that checks if an object has a property.
  * @param obj The object to check.
  * @returns A PropChecker instance that can be used to check for properties.
  **/
class PropChecker {
  constructor(private obj: unknown) {}

  /**
    * Check if the object has the given property.
    * @param prop The property to check for.
    **/
  check(prop: string): boolean {
    const obj = this.obj as Record<string, unknown>;
    return obj.hasOwnProperty(prop);
  }


  /**
    * Check if the object is truthy.
    * @throws An error if the object is not truthy.
    **/
  checkIfTruthy(): void {
  if (!this.obj) return thrw("Target must be truthy");
  }

  /**
    * Check if the object is an object.
    * @throws An error if the object is not an object.
    **/
  checkIfObject(): void {
  if (typeof this.obj !== "object") return thrw("Target must be an object");
  }
}
