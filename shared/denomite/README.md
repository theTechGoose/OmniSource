# Denomite


folder structure
- module-name   #use the module name
  - core        #main logic
    - mod.ts    #Base class or logic goes here
    - test.ts      # Testing base class
  - helpers/    #concrete implementations or helpers
  - models.ts       # Shared
  - test.ts         
  - mod.ts  







## Overview
This library provides a modular and extensible framework for handling server-side functionality, integrations, and shared utilities.

## Folder Structure

### `core/`
Contains the foundational modules of the library:
- `auth/`: Authentication logic.
- `server/`: Core server setup and configurations.

### `features/`
Encapsulates primary features:
- `endpoint/`: REST or RPC endpoints.
- `resolver/`: Resolvers for handling queries and logic.

### `integrations/`
Manages connections to external APIs and services:
- `postmark/`: Email services.
- `slick-text/`: SMS services.

### `infrastructure/`
Handles low-level infrastructure concerns:
- `database/`: Database setup and interactions.
- `http/`: HTTP handling logic.
- `logger/`: Logging utilities.

### `shared/`
Stores reusable elements:
- `models.ts`: Shared data models.
- `constants.ts`: Application constants.

### Root Files
- `index.ts`: Library entry point.
- `mod.ts`: Export module for external usage.
- `deno.json`: Configuration file for Deno.

---

## Usage
[Provide a brief example or explanation of how to use the library here.]
