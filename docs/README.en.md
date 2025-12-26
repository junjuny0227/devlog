# develog

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)

> A lightweight frontend logger that runs only in local/dev environments

`develog` is a smart logging library that automatically detects the environment based on the browser's hostname and outputs logs only in development environments. It is automatically disabled in production to prevent unnecessary log output.

## Features

- **Automatic Environment Detection**: Detects environment automatically based on hostname patterns (local/dev/stage/production)
- **Selective Activation**: Output logs only in specific environments
- **Namespace Support**: Separate and filter logs by module
- **Timestamp Support**: 4 format options (time/datetime/iso/ms)
- **Custom Configuration**: Customize hostname patterns, prefix, and more
- **Full TypeScript Support**: Written in TypeScript for type safety
- **Lightweight**: Zero production dependencies
- **Browser Native**: Wraps standard console API

## Installation

```bash
# npm
npm install develog

# yarn
yarn add develog

# pnpm
pnpm add develog
```

## Quick Start

### Basic Usage

```typescript
import { develog } from 'develog';

// Basic logging
develog.log('General log');
develog.info('Info message');
develog.warn('Warning message');
develog.error('Error message');
develog.debug('Debug information');

// Multiple arguments
develog.log('User login:', { userId: 123, role: 'admin' });
```

### Creating Custom Instance

```typescript
import { Develog } from 'develog';

const logger = new Develog({
  prefix: '[MyApp]',
  enabledEnvironments: ['local', 'dev'],
  showTimestamp: true,
  timestampFormat: 'time',
});

logger.info('Using custom logger');
// Output: [MyApp] [15:30:45] Using custom logger
```

## Environment Detection

`develog` automatically detects the environment based on `window.location.hostname`.

### Default Environment Patterns

| Environment    | Hostname Pattern                           | Examples                                |
| -------------- | ------------------------------------------ | --------------------------------------- |
| **local**      | `localhost`, `127.0.0.1`, `0.0.0.0`, `::1` | `localhost:3000`                        |
| **dev**        | Contains `.dev.`, `.development.`          | `dev.example.com`, `app.development.io` |
| **stage**      | Contains `.stage.`, `.staging.`            | `staging.example.com`, `app.stage.io`   |
| **production** | Contains `.www.`, `.prod.`, `.production.` | `www.example.com`, `prod.app.io`        |
| **unknown**    | No match                                   | `random.domain.com`                     |

### Default Enabled Environments

By default, logs are output only in `local`, `dev`, and `stage` environments.

```typescript
// Output only in local, dev, stage
develog.log('This log appears only in development environments');

// Check environment
console.log(develog.getEnvironment()); // 'local' | 'dev' | 'stage' | 'production' | 'unknown'
console.log(develog.isLoggingEnabled()); // true | false
```

### Custom Environment Patterns

```typescript
const logger = new Develog({
  customHostnamePatterns: {
    dev: /^(dev|test|qa)\./,
    stage: /^(stage|uat|preprod)\./,
    production: /^(www|api|app)\./,
  },
});
```

### Force Environment

```typescript
// Force specific environment regardless of actual hostname
const logger = new Develog({
  forceEnvironment: 'production',
});
```

## Namespaces

You can separate and filter logs by module or feature.

### Basic Namespace

```typescript
import { develog } from 'develog';

// Create namespace loggers
const apiLogger = develog.namespace('API');
const dbLogger = develog.namespace('DB');
const cacheLogger = develog.namespace('Cache');

apiLogger.log('API request started');
// Output: [develog]:API API request started

dbLogger.info('Database query executed');
// Output: [develog]:DB Database query executed

cacheLogger.debug('Cache lookup');
// Output: [develog]:Cache Cache lookup
```

### Hierarchical Namespace

```typescript
const apiLogger = develog.namespace('API');
const userApiLogger = apiLogger.namespace('User');
const authLogger = userApiLogger.namespace('Auth');

authLogger.log('User authentication completed');
// Output: [develog]:API:User:Auth User authentication completed
```

### Namespace Filtering

You can enable only specific namespaces.

```typescript
// Enable only API namespace
const logger = new Develog({
  enabledNamespaces: ['API'],
});

const apiLogger = logger.namespace('API');
const dbLogger = logger.namespace('DB');

apiLogger.log('This log is shown'); // Shown
dbLogger.log('This log is hidden'); // Hidden
```

### Wildcard Pattern

```typescript
// Enable all namespaces starting with API
const logger = new Develog({
  enabledNamespaces: ['API:*'],
});

const apiLogger = logger.namespace('API');
const userApiLogger = apiLogger.namespace('User');
const productApiLogger = apiLogger.namespace('Product');
const dbLogger = logger.namespace('DB');

apiLogger.log('Shown'); // Shown
userApiLogger.log('Shown'); // Shown (API:User)
productApiLogger.log('Shown'); // Shown (API:Product)
dbLogger.log('Hidden'); // Hidden
```

### Enable All Namespaces

```typescript
const logger = new Develog({
  enabledNamespaces: ['*'], // Enable all namespaces
});
```

## Timestamps

You can add timestamps to logs.

```typescript
const logger = new Develog({
  showTimestamp: true,
  timestampFormat: 'time', // 'time' | 'datetime' | 'iso' | 'ms'
});

logger.log('Log with timestamp');
```

### Timestamp Formats

| Format     | Pattern                       | Example                                        |
| ---------- | ----------------------------- | ---------------------------------------------- |
| `time`     | `HH:MM:SS`                    | `[develog] [15:30:45] Message`                 |
| `datetime` | `YYYY-MM-DD HH:MM:SS`         | `[develog] [2025-12-27 15:30:45] Message`      |
| `iso`      | ISO 8601                      | `[develog] [2025-12-27T15:30:45.123Z] Message` |
| `ms`       | Unix timestamp (milliseconds) | `[develog] [1735308645123] Message`            |

### Timestamp Utility

```typescript
import { formatTimestamp } from 'develog';

const timestamp = formatTimestamp('datetime');
console.log(timestamp); // '2025-12-27 15:30:45'
```

## Advanced Features

### Group Logging

```typescript
develog.group('User Information');
develog.log('Name: John Doe');
develog.log('Email: john@example.com');
develog.log('Role: Developer');
develog.groupEnd();

// Start collapsed
develog.groupCollapsed('API Request Details');
develog.log('URL: https://api.example.com/users');
develog.log('Method: GET');
develog.groupEnd();
```

### Table Output

```typescript
const users = [
  { id: 1, name: 'John', role: 'Admin' },
  { id: 2, name: 'Jane', role: 'User' },
  { id: 3, name: 'Bob', role: 'User' },
];

develog.table(users);
```

### Time Measurement

```typescript
develog.time('API call');

// Async operation
await fetch('https://api.example.com/data');

develog.timeEnd('API call');
// Output: [develog] API call: 245.23ms
```

### Counter

```typescript
develog.count('Click event');
develog.count('Click event');
develog.count('Click event');
// Output: [develog] Click event: 3

develog.countReset('Click event'); // Reset counter
```

### Clear Console

```typescript
develog.clear();
```

## API Reference

### Develog Class

#### Constructor

```typescript
new Develog(options?: LoggerOptions)
```

#### Methods

| Method                   | Description                       |
| ------------------------ | --------------------------------- |
| `log(...args)`           | Output general log                |
| `info(...args)`          | Output info log                   |
| `warn(...args)`          | Output warning log                |
| `error(...args)`         | Output error log                  |
| `debug(...args)`         | Output debug log                  |
| `group(label?)`          | Start group                       |
| `groupCollapsed(label?)` | Start collapsed group             |
| `groupEnd()`             | End group                         |
| `table(data)`            | Output in table format            |
| `time(label)`            | Start time measurement            |
| `timeEnd(label)`         | End time measurement and output   |
| `count(label?)`          | Count executions                  |
| `countReset(label?)`     | Reset count                       |
| `clear()`                | Clear console                     |
| `namespace(name)`        | Create namespace logger           |
| `getEnvironment()`       | Return current environment        |
| `isLoggingEnabled()`     | Return whether logging is enabled |

### LoggerOptions

```typescript
interface LoggerOptions {
  // List of environments where logging is enabled
  enabledEnvironments?: Environment[]; // Default: ['local', 'dev', 'stage']

  // Custom hostname patterns for environment detection
  customHostnamePatterns?: {
    [key in Environment]?: RegExp;
  };

  // Prefix for log output
  prefix?: string; // Default: '[develog]'

  // Force environment (ignore auto-detection)
  forceEnvironment?: Environment;

  // Show timestamp
  showTimestamp?: boolean; // Default: false

  // Timestamp format
  timestampFormat?: TimestampFormat; // Default: 'time'

  // List of enabled namespaces
  enabledNamespaces?: string[]; // Default: undefined (all enabled)
}
```

### Type Definitions

```typescript
type Environment = 'local' | 'dev' | 'stage' | 'production' | 'unknown';
type TimestampFormat = 'time' | 'datetime' | 'iso' | 'ms';
type LogLevel = 'log' | 'info' | 'warn' | 'error' | 'debug';
```

### Utility Functions

```typescript
// Detect environment
function detectEnvironment(customPatterns?: Partial<Record<Environment, RegExp>>): Environment;

// Format timestamp
function formatTimestamp(format?: TimestampFormat): string;
```

## Usage Examples

### React Application

```typescript
// logger.ts
import { Develog } from 'develog';

export const logger = new Develog({
  prefix: '[MyReactApp]',
  showTimestamp: true,
  timestampFormat: 'time',
  enabledNamespaces: ['*'],
});

export const apiLogger = logger.namespace('API');
export const storeLogger = logger.namespace('Store');
export const uiLogger = logger.namespace('UI');
```

```typescript
// components/UserList.tsx
import { apiLogger, uiLogger } from './logger';

function UserList() {
  useEffect(() => {
    const fetchUsers = async () => {
      apiLogger.log('User list request started');

      try {
        const response = await fetch('/api/users');
        const users = await response.json();

        apiLogger.info('User list loaded successfully', users);
        uiLogger.log('UI rendering started');
      } catch (error) {
        apiLogger.error('Failed to load user list', error);
      }
    };

    fetchUsers();
  }, []);

  return <div>...</div>;
}
```

### Next.js Application

```typescript
// lib/logger.ts
import { Develog } from 'develog';

// Only works on client-side
export const logger =
  typeof window !== 'undefined'
    ? new Develog({
        prefix: '[NextApp]',
        showTimestamp: true,
      })
    : null;

// Safe logging helper
export const safeLog = (...args: any[]) => {
  logger?.log(...args);
};
```

### Vue Application

```typescript
// plugins/logger.ts
import { Develog } from 'develog';

const logger = new Develog({
  prefix: '[VueApp]',
  enabledEnvironments: ['local', 'dev'],
});

export default {
  install(app: App) {
    app.config.globalProperties.$logger = logger;
  },
};
```

```vue
<script setup>
import { getCurrentInstance } from 'vue';

const instance = getCurrentInstance();
const logger = instance?.appContext.config.globalProperties.$logger;

logger.log('Component mounted');
</script>
```

### API Client

```typescript
import { Develog } from 'develog';

class ApiClient {
  private logger = new Develog({
    prefix: '[API]',
    showTimestamp: true,
    timestampFormat: 'time',
  });

  async request(url: string, options?: RequestInit) {
    const requestId = Math.random().toString(36).substr(2, 9);

    this.logger.group(`Request ${requestId}`);
    this.logger.log('URL:', url);
    this.logger.log('Options:', options);

    this.logger.time(`Request ${requestId}`);

    try {
      const response = await fetch(url, options);
      const data = await response.json();

      this.logger.timeEnd(`Request ${requestId}`);
      this.logger.info('Response:', data);
      this.logger.groupEnd();

      return data;
    } catch (error) {
      this.logger.error('Request failed:', error);
      this.logger.groupEnd();
      throw error;
    }
  }
}
```

## FAQ

### Q: Is it completely disabled in production?

A: Yes! Logging methods do nothing in production environment, so it doesn't affect performance.

### Q: Can I use it in SSR environments?

A: It's designed to work only in browser environments. If the `window` object is not available, it automatically detects as `unknown` environment.

### Q: How do I migrate existing logs to develog?

A: Simply replace `console.log` with `develog.log`. The API is compatible with standard console.

### Q: Is tree-shaking supported?

A: Yes! It uses ESM bundle and supports tree-shaking.

### Q: TypeScript support?

A: Fully supported. All type definitions are included.

## Contributing

Bug reports, feature suggestions, and Pull Requests are welcome!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

MIT License - See [LICENSE.md](LICENSE.md) file for details.

## Links

- [GitHub Repository](https://github.com/junjuny0227/develog)
- [npm Package](https://www.npmjs.com/package/develog)
- [Issues](https://github.com/junjuny0227/develog/issues)

## Author

**junjuny** - [@junjuny0227](https://github.com/junjuny0227)

---

<p align="center">
  Made with love by junjuny
</p>
