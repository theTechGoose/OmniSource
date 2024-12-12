# OmniSource

A sophisticated Deno-based monorepo with advanced dependency injection and server framework capabilities.

## Core Systems

### Dependency Injection System
- Metadata-based dependency resolution using TypeScript reflect API
- Singleton instance management
- Circular dependency detection
- Runtime type information extraction

### Server Framework
- Plugin-based architecture
- Controller decorators for endpoint registration
- Middleware support
- Flexible request handling

### Utilities Library
- Comprehensive utility functions
- Well-documented modules
- Located in `libs/utilities`
- See [utilities documentation](./libs/utilities/README.md) for details

## Project Structure
```typescript
project-root/
├── libs/
│   └── utilities/      # Shared utility functions
├── deno.json          # Project configuration
└── magic-values.ts    # Centralized string management
```

## Development Setup
1. Install Deno
2. Clone the repository
3. Install dependencies:
```shell
deno cache deps.ts
```

## Development Guidelines

### Branch Management
- Work from the `develop` branch
- Create feature branches: `develop-<yourName>-<featureName>`
- Submit PRs back to `develop`

### Code Organization
- Place global types in root types directory
- Define types locally when possible
- Use `@` prefix for internal imports
- Use `#` prefix for external imports

### Testing
- Write unit tests for all new code
- Integration tests in module `e2e.ts` files
- Limited E2E tests for critical paths
- Run tests: `deno test`
- Format code: `deno fmt`
- Lint code: `deno lint`

### Magic Values
- Store all magic strings in `magic-values.ts`
- Access through the `vault` object
- Use `resolve` function for scoped variables
- Follow existing patterns for new additions

## Deployment
Deployment is handled through Deno Deploy platform.

## Contributing
See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines.
