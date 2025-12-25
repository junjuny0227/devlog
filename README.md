# devlog

A lightweight frontend logger that runs only in local/dev environments.

브라우저의 hostname 또는 IP를 감지하여 실행 환경을 자동으로 판별하고, dev/stage 및 local 환경에서만 로깅을 활성화하는 TypeScript 기반 경량 로거 라이브러리입니다.

## Features

- 자동 환경 감지: 브라우저의 hostname/IP로 실행 환경 자동 판별
- 선택적 로깅: dev/stage/local 환경에서만 로깅 활성화 (프로덕션에서는 자동 비활성화)
- 풍부한 API: console의 모든 기능 지원 (log, info, warn, error, debug, group, table 등)
- 경량: 의존성 없는 순수 TypeScript 구현
- 커스터마이징: 환경 패턴, prefix, 활성화 환경 등 유연한 설정
- 범용성: React, Vue, Angular 등 모든 프론트엔드 프레임워크와 호환

## Installation

```bash
npm install devlog
# or
yarn add devlog
# or
pnpm add devlog
```

## Quick Start

### Basic Usage

```typescript
import { devlog } from 'devlog';

// 환경이 자동으로 감지되고, local/dev/stage에서만 로그가 출력됩니다
devlog.log('안녕하세요!');
devlog.info('정보 메시지');
devlog.warn('경고 메시지');
devlog.error('에러 메시지');
devlog.debug('디버그 정보');
```

### 커스텀 인스턴스

```typescript
import { Devlog } from 'devlog';

const logger = new Devlog({
  prefix: '[MyApp]',
  enabledEnvironments: ['local', 'dev', 'stage'],
  customHostnamePatterns: {
    dev: /^dev\./,
    stage: /^staging\./,
  },
});

logger.log('커스텀 로거 사용');
```

## Environment Detection

devlog는 다음과 같이 환경을 자동으로 감지합니다:

| 환경           | 기본 패턴                                  | 예시                  |
| -------------- | ------------------------------------------ | --------------------- |
| **local**      | `localhost`, `127.0.0.1`, `0.0.0.0`, `::1` | `localhost:3000`      |
| **dev**        | `dev.`, `development.`로 시작              | `dev.example.com`     |
| **stage**      | `stage.`, `staging.`로 시작                | `staging.example.com` |
| **production** | `prod.`, `production.`, `www.`로 시작      | `www.example.com`     |

## API Reference

### Logging Methods

```typescript
devlog.log(...args: unknown[]): void
devlog.info(...args: unknown[]): void
devlog.warn(...args: unknown[]): void
devlog.error(...args: unknown[]): void
devlog.debug(...args: unknown[]): void
```

### Group Logging

```typescript
devlog.group(label?: string): void
devlog.groupCollapsed(label?: string): void
devlog.groupEnd(): void
```

Example:

```typescript
devlog.group('사용자 정보');
devlog.log('이름: 홍길동');
devlog.log('이메일: hong@example.com');
devlog.groupEnd();
```

### Advanced Features

```typescript
// 테이블 출력
devlog.table(data: unknown): void

// 시간 측정
devlog.time(label: string): void
devlog.timeEnd(label: string): void

// 카운트
devlog.count(label?: string): void
devlog.countReset(label?: string): void

// 콘솔 지우기
devlog.clear(): void
```

Example:

```typescript
// 시간 측정
devlog.time('API 호출');
await fetchData();
devlog.timeEnd('API 호출');

// 테이블 출력
const users = [
  { id: 1, name: '김철수' },
  { id: 2, name: '이영희' },
];
devlog.table(users);
```

### Configuration Options

```typescript
interface LoggerOptions {
  // 로깅이 활성화될 환경 (기본값: ['local', 'dev', 'stage'])
  enabledEnvironments?: Environment[];

  // 커스텀 hostname 패턴
  customHostnamePatterns?: {
    [key in Environment]?: RegExp;
  };

  // 로그 prefix (기본값: '[devlog]')
  prefix?: string;

  // 강제로 환경 설정 (자동 감지 무시)
  forceEnvironment?: Environment;
}
```

## Examples

### React

```typescript
import { devlog } from 'devlog';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    devlog.info('App 컴포넌트 마운트됨');

    return () => {
      devlog.info('App 컴포넌트 언마운트됨');
    };
  }, []);

  const handleClick = async () => {
    devlog.time('API 호출');
    try {
      const data = await fetchData();
      devlog.log('데이터:', data);
    } catch (error) {
      devlog.error('에러:', error);
    } finally {
      devlog.timeEnd('API 호출');
    }
  };

  return <button onClick={handleClick}>클릭</button>;
}
```

### Vue

```typescript
import { devlog } from 'devlog';
import { onMounted } from 'vue';

export default {
  setup() {
    onMounted(() => {
      devlog.info('컴포넌트 마운트됨');
    });

    const handleSubmit = () => {
      devlog.group('폼 제출');
      devlog.log('검증 시작...');
      // 폼 처리 로직
      devlog.groupEnd();
    };

    return { handleSubmit };
  },
};
```

### API 호출 로깅

```typescript
import { Devlog } from 'devlog';

const apiLogger = new Devlog({ prefix: '[API]' });

async function fetchUser(id: string) {
  apiLogger.time(`fetchUser-${id}`);
  apiLogger.log('요청:', { id });

  try {
    const response = await fetch(`/api/users/${id}`);
    const user = await response.json();
    apiLogger.info('응답:', user);
    return user;
  } catch (error) {
    apiLogger.error('실패:', error);
    throw error;
  } finally {
    apiLogger.timeEnd(`fetchUser-${id}`);
  }
}
```

## Development

```bash
# Install dependencies
pnpm install

# Development mode (watch)
pnpm dev

# Build
pnpm build

# Type check
pnpm type-check

# Format code
pnpm format
```

## License

MIT © [junjuny](https://github.com/junjuny0227)
