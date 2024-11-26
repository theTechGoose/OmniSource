# Utilities

This library provides a comprehensive suite of utilities to enhance productivity by addressing common programming challenges. It is modular, well-organized, and designed for use with Deno projects.

---

## Table of Contents

- [Installation](#installation)
- [Modules and Functions](#modules-and-functions)
  - [Higher-Order Functions](#1-higher-order-functions)
  - [Core Utilities](#2-core-utilities)
  - [String Manipulation](#3-string-manipulation)
  - [Array Utilities](#4-array-utilities)
  - [Validation Utilities](#5-validation-utilities)
- [Contributing](#contributing)
- [License](#license)

---

## Installation

To use this library in your Deno project, simply import it as follows:

```typescript
import * as utils from "./mod.ts";
```

---

## Modules and Functions

### 1. **Higher-Order Functions**
Utilities leveraging functional programming principles.

#### Functions:
- **`withTryCatch<T>`**  
  Wraps a function in a `try-catch` block, returning a tuple `[result, error]`.  
  Works with both synchronous and asynchronous functions.
  **Example:**
  ```typescript
  const [result, error] = await withTryCatch(async () => await fetchData());
  if (error) console.error("Error:", error);
  ```

---

### 2. **Core Utilities**
Foundational tools supporting various programming tasks.

#### Functions:
- **`getStackTrace`**  
  Generates a stack trace and retrieves caller file paths.  
  **Example:**
  ```typescript
  const trace = getStackTrace();
  console.log(trace.getFirst("path"));
  ```

- **`sleep`**  
  Pauses execution for a specified duration.  
  **Example:**
  ```typescript
  await sleep(2000); // Sleep for 2 seconds
  ```

- **`thrw`**  
  Throws a custom error message programmatically.  
  **Example:**
  ```typescript
  thrw("Custom error message");
  ```

---

### 3. **String Manipulation**
Utilities for transforming strings.

#### Functions:
- **`camelToKebabCase`**  
  Converts a camelCase string to kebab-case.  
  **Example:**
  ```typescript
  console.log(camelToKebabCase("camelCaseString")); // Outputs: camel-case-string
  ```

---

### 4. **Array Utilities**
Simplifies array operations with helper functions.

#### Functions:
- **`push`**  
  Mimics `array.push` but returns the pushed element.  
  **Example:**
  ```typescript
  const myArray = [1, 2, 3];
  const newElement = push(4, myArray);
  console.log(myArray); // [1, 2, 3, 4]
  console.log(newElement); // 4
  ```

---

### 5. **Validation Utilities**
Ensures data integrity with validation tools.

#### Functions:
- **`chkProps`**  
  Validates that an object contains specific properties.  
  **Example:**
  ```typescript
  const obj = { name: "Alice", age: 25 };
  const isValid = chkProps(obj, "name", "age");
  console.log(isValid); // true
  ```

---

## Contributing

Contributions are welcome! Please ensure code quality by running `deno fmt` and `deno lint` before submitting a pull request.

---

## License

This project is licensed under the MIT License.
