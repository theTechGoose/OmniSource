# Contributing to OmniSource

## Development Workflow

### Setting Up Development Environment
1. Install Deno
2. Clone the repository
3. Install dependencies

### Branch Management
- Base your work on the `develop` branch
- Create feature branches: `develop-<yourName>-<featureName>`
- Keep PRs focused and well-scoped

### Code Organization

#### Module Structure
```typescript
<moduleName>/
├── catalog/      # Helper functions
│   ├── mod.ts    # Logic implementation
│   └── test.ts   # Unit tests
├── setup/        # Module setup helpers
├── test-data/    # Test data files
├── e2e.ts        # Integration tests
└── mod.ts        # Entry point
```

#### Simplified Structure (when appropriate)
```typescript
<moduleName>/
├── mod.ts
└── deno.json
```

### Testing Strategy
1. Unit Tests
   - Write tests for all new code
   - One test file per implementation file
   - Follow existing test patterns
   - Located alongside implementation files

2. Integration Tests
   - Test module interactions
   - Located in `e2e.ts` files
   - Focus on critical paths

3. E2E Tests
   - Limited to essential user flows
   - Focus on critical business logic

### Code Style
- Use `deno fmt` for formatting
- Follow `deno lint` guidelines
- Use meaningful variable names
- Document complex logic

### Magic Values Management
1. Adding New Values
   - Add to `magic-values.ts`
   - Scope variables by project
   - Use `resolve` function for access
   - Document purpose and usage

2. Best Practices
   - Avoid hardcoded strings/numbers
   - Use descriptive variable names
   - Consider scope (global vs project)
   - Follow existing patterns

### Pull Request Process
1. Create feature branch
2. Make focused changes
3. Write clear commit messages
4. Update documentation
5. Submit PR to develop branch

### Type Management
- Define types locally when possible
- Use TypeScript strict mode
- Leverage type inference
- Document complex types
