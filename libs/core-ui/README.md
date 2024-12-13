# Core UI Library

A minimalist UI component library focused on component isolation and story-based
development.

## Components

- Button: A versatile button component with various styles and sizes

## Usage

Components can be imported directly and used in your Fresh projects:

```tsx
import { Button } from "../components/Button/mod.tsx";

export default function MyComponent() {
  return <Button variant="primary">Click me</Button>;
}
```

## Development

View component stories by running the development server:

```bash
deno task check   # Type check and lint
deno task test    # Run tests
```

## Architecture

The library follows a simple structure focused on component isolation:

```
core-ui/
 components/     # UI components
   └── Button/
       ├── mod.tsx      # Component implementation
       └── test.tsx     # Component tests
 islands/       # Interactive components
   └── stories/   # Component stories
 routes/        # Story rendering
```
