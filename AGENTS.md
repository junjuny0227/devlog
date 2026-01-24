# AGENTS.md

This file contains guidelines and commands for agentic coding agents working in this repository.

## Project Overview

This is **develog** - a lightweight frontend logger that runs only in local/dev environments. It's a TypeScript library with ESM/CJS dual exports, built for browser environments.

## Build & Development Commands

### Core Commands

- `pnpm run build` - Build the library (uses tsup)
- `pnpm run dev` - Build in watch mode
- `pnpm run type-check` - Run TypeScript type checking without emitting files

### Testing Commands

- `pnpm run test` - Run all tests once
- `pnpm run test:watch` - Run tests in watch mode
- `pnpm run test:ui` - Run tests with Vitest UI
- `pnpm run test:coverage` - Run tests with coverage report

**To run a single test file:**

```bash
pnpm run test src/__tests__/logger.test.ts
```

### Code Quality Commands

- `pnpm run lint` - Run ESLint
- `pnpm run lint:fix` - Run ESLint with auto-fix
- `pnpm run format` - Format code with Prettier
- `pnpm run format:check` - Check code formatting

## Code Style Guidelines

### TypeScript Configuration

- Target: ES2020
- Module: ESNext with bundler resolution
- Strict mode enabled
- Always use explicit types for public APIs
- Use `unknown` instead of `any` when possible (but `any` is allowed with warning)

### Import Style

- Use ES6 imports/exports consistently
- Import types with `import type` for type-only imports
- Group imports: external libraries first, then internal modules
- Example:

```typescript
import { describe, it, expect } from 'vitest';
import { Develog } from '../logger';
import type { LoggerOptions } from '../types';
```

### Naming Conventions

- Classes: PascalCase (e.g., `Develog`)
- Functions/Methods: camelCase (e.g., `detectEnvironment`)
- Variables: camelCase
- Constants: UPPER_SNAKE_CASE for exported constants
- Private members: prefix with `#` or `private` keyword
- Interface names: PascalCase, no "I" prefix
- Type names: PascalCase, descriptive names

### Error Handling

- Use try-catch blocks for external API calls
- Return early for error conditions
- Don't throw errors in library code unless absolutely necessary
- Log errors appropriately using the logger itself

### Code Organization

- Keep files focused on single responsibility
- Export related functionality from index files
- Use barrel exports for clean public APIs
- Separate types into dedicated `types.ts` files

### Documentation

- Use JSDoc comments for public APIs
- Include parameter types and return types in comments
- Use Korean comments for implementation details (as seen in existing code)
- Document complex logic with inline comments

### Testing Style

- Use Vitest with happy-dom environment
- Mock console methods in tests
- Use `describe` blocks for logical grouping
- Use `beforeEach`/`afterEach` for setup/teardown
- Test both positive and negative cases
- Use descriptive test names in Korean (following existing pattern)

### ESLint Rules

- Unused variables with `_` prefix are allowed
- No explicit function return type required
- `any` types are allowed but generate warnings
- Console usage is allowed (this is a logger library)
- Prettier integration for consistent formatting

### Build Configuration

- Uses tsup for building with dual ESM/CJS output
- Generates declaration files (.d.ts)
- Includes source maps
- Targets ES2020
- Tree-shaking enabled

### Environment Detection

The library includes sophisticated environment detection:

- `local`: localhost, 127.0.0.1, etc.
- `dev`: dev.\* domains
- `stage`: staging._, stage._ domains
- `production`: www.\* domains, production hosts
- `unknown`: everything else

### Package Management

- Uses pnpm as package manager (version 10.26.0)
- All scripts should use `pnpm run` not `npm run`

## Development Workflow

1. Always run `pnpm run type-check` before committing
2. Run `pnpm run lint:fix` to auto-fix linting issues
3. Ensure all tests pass: `pnpm run test`
4. Check coverage with `pnpm run test:coverage`
5. Build before publishing: `pnpm run build`

## Library-Specific Guidelines

- The logger should be silent in production by default
- Support namespace-based filtering
- Include timestamp formatting options
- Maintain browser compatibility
- Keep bundle size minimal
- Preserve console method signatures
