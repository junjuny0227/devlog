# develog

[![npm downloads](https://img.shields.io/npm/dt/develog.svg)](https://www.npmjs.com/package/develog)
[![GitHub repo size](https://img.shields.io/github/repo-size/junjuny0227/develog.svg)](https://github.com/junjuny0227/develog)
[![npm version](https://img.shields.io/npm/v/develog.svg)](https://www.npmjs.com/package/develog)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> A lightweight frontend logger that runs only in local/dev environments

A smart logging library that automatically detects the environment based on the browser's hostname and outputs logs only in development environments.

## Documentation

- [English Documentation](./docs/README.en.md)
- [한국어 문서](./docs/README.ko.md)

## Quick Start

### Installation

```bash
# npm
npm install develog

# yarn
yarn add develog

# pnpm
pnpm add develog
```

### Basic Usage

```typescript
import { develog } from 'develog';

develog.log('This log appears only in development environments');
develog.info('Info message');
develog.warn('Warning message');
develog.error('Error message');
```

## Features

- **Automatic Environment Detection** - Based on hostname patterns
- **Namespace Support** - Separate logs by module
- **Timestamp Support** - 4 format options
- **TypeScript Support** - Full type safety
- **Zero Dependencies** - Lightweight package
- **Production Safe** - Automatically disabled in production

## Links

- [GitHub Repository](https://github.com/junjuny0227/develog)
- [npm Package](https://www.npmjs.com/package/develog)
- [Issues](https://github.com/junjuny0227/develog/issues)

## License

MIT License - See [LICENSE.md](LICENSE.md)

## Author

**junjuny** - [@junjuny0227](https://github.com/junjuny0227)
