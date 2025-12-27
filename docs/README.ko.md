# develog

[![npm downloads](https://img.shields.io/npm/dt/develog.svg)](https://www.npmjs.com/package/develog)
[![GitHub repo size](https://img.shields.io/github/repo-size/junjuny0227/develog.svg)](https://github.com/junjuny0227/develog)
[![npm version](https://img.shields.io/npm/v/develog.svg)](https://www.npmjs.com/package/develog)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> 개발/로컬 환경에서만 동작하는 경량 프론트엔드 로거

`develog`는 브라우저의 hostname을 기반으로 자동으로 환경을 감지하여, 개발 환경에서만 로그를 출력하는 스마트한 로깅 라이브러리입니다. 프로덕션 환경에서는 자동으로 비활성화되어 불필요한 로그 출력을 방지합니다.

## 주요 기능

- **자동 환경 감지**: hostname 패턴 기반 환경 자동 감지 (local/dev/stage/production)
- **선택적 활성화**: 특정 환경에서만 로그 출력
- **네임스페이스**: 모듈별 로그 분리 및 필터링
- **타임스탬프**: 4가지 포맷 지원 (time/datetime/iso/ms)
- **커스텀 설정**: hostname 패턴, prefix 등 커스터마이징 가능
- **완벽한 타입 지원**: TypeScript로 작성되어 타입 안전성 보장
- **경량**: 프로덕션 의존성 제로
- **브라우저 네이티브**: 표준 console API 래핑

## 설치

```bash
# npm
npm install develog

# yarn
yarn add develog

# pnpm
pnpm add develog
```

## 빠른 시작

### 기본 사용법

```typescript
import { develog } from 'develog';

// 기본 로깅
develog.log('일반 로그');
develog.info('정보 메시지');
develog.warn('경고 메시지');
develog.error('에러 메시지');
develog.debug('디버그 정보');

// 여러 인자 전달
develog.log('사용자 로그인:', { userId: 123, role: 'admin' });
```

### 커스텀 인스턴스 생성

```typescript
import { Develog } from 'develog';

const logger = new Develog({
  prefix: '[MyApp]',
  enabledEnvironments: ['local', 'dev'],
  showTimestamp: true,
  timestampFormat: 'time',
});

logger.info('커스텀 로거 사용');
// 출력: [MyApp] [15:30:45] 커스텀 로거 사용
```

## 환경 감지

`develog`는 `window.location.hostname`을 기반으로 자동으로 환경을 감지합니다.

### 기본 환경 패턴

| 환경           | hostname 패턴                              | 예시                                    |
| -------------- | ------------------------------------------ | --------------------------------------- |
| **local**      | `localhost`, `127.0.0.1`, `0.0.0.0`, `::1` | `localhost:3000`                        |
| **dev**        | `.dev.`, `.development.` 포함              | `dev.example.com`, `app.development.io` |
| **stage**      | `.stage.`, `.staging.` 포함                | `staging.example.com`, `app.stage.io`   |
| **production** | `.www.`, `.prod.`, `.production.` 포함     | `www.example.com`, `prod.app.io`        |
| **unknown**    | 매칭되지 않는 경우                         | `random.domain.com`                     |

### 기본 활성화 환경

기본적으로 `local`, `dev`, `stage` 환경에서만 로그가 출력됩니다.

```typescript
// local, dev, stage에서만 출력됨
develog.log('이 로그는 개발 환경에서만 보입니다');

// 환경 확인
console.log(develog.getEnvironment()); // 'local' | 'dev' | 'stage' | 'production' | 'unknown'
console.log(develog.isLoggingEnabled()); // true | false
```

### 커스텀 환경 패턴

```typescript
const logger = new Develog({
  customHostnamePatterns: {
    dev: /^(dev|test|qa)\./,
    stage: /^(stage|uat|preprod)\./,
    production: /^(www|api|app)\./,
  },
});
```

### 환경 강제 설정

```typescript
// 실제 hostname과 관계없이 특정 환경으로 강제 설정
const logger = new Develog({
  forceEnvironment: 'production',
});
```

## 네임스페이스

모듈이나 기능별로 로그를 분리하고 필터링할 수 있습니다.

### 기본 네임스페이스

```typescript
import { develog } from 'develog';

// 네임스페이스별 로거 생성
const apiLogger = develog.namespace('API');
const dbLogger = develog.namespace('DB');
const cacheLogger = develog.namespace('Cache');

apiLogger.log('API 요청 시작');
// 출력: [develog]:API API 요청 시작

dbLogger.info('데이터베이스 쿼리 실행');
// 출력: [develog]:DB 데이터베이스 쿼리 실행

cacheLogger.debug('캐시 조회');
// 출력: [develog]:Cache 캐시 조회
```

### 계층적 네임스페이스

```typescript
const apiLogger = develog.namespace('API');
const userApiLogger = apiLogger.namespace('User');
const authLogger = userApiLogger.namespace('Auth');

authLogger.log('사용자 인증 완료');
// 출력: [develog]:API:User:Auth 사용자 인증 완료
```

### 네임스페이스 필터링

특정 네임스페이스만 활성화할 수 있습니다.

```typescript
// API 네임스페이스만 활성화
const logger = new Develog({
  enabledNamespaces: ['API'],
});

const apiLogger = logger.namespace('API');
const dbLogger = logger.namespace('DB');

apiLogger.log('이 로그는 출력됨'); // 출력됨
dbLogger.log('이 로그는 숨겨짐'); // 출력 안됨
```

### 와일드카드 패턴

```typescript
// API로 시작하는 모든 네임스페이스 활성화
const logger = new Develog({
  enabledNamespaces: ['API:*'],
});

const apiLogger = logger.namespace('API');
const userApiLogger = apiLogger.namespace('User');
const productApiLogger = apiLogger.namespace('Product');
const dbLogger = logger.namespace('DB');

apiLogger.log('출력됨'); // 출력됨
userApiLogger.log('출력됨'); // 출력됨 (API:User)
productApiLogger.log('출력됨'); // 출력됨 (API:Product)
dbLogger.log('숨겨짐'); // 출력 안됨
```

### 모든 네임스페이스 활성화

```typescript
const logger = new Develog({
  enabledNamespaces: ['*'], // 모든 네임스페이스 활성화
});
```

## 타임스탬프

로그에 타임스탬프를 추가할 수 있습니다.

```typescript
const logger = new Develog({
  showTimestamp: true,
  timestampFormat: 'time', // 'time' | 'datetime' | 'iso' | 'ms'
});

logger.log('타임스탬프 포함 로그');
```

### 타임스탬프 포맷

| 포맷       | 형식                    | 예시                                          |
| ---------- | ----------------------- | --------------------------------------------- |
| `time`     | `HH:MM:SS`              | `[develog] [15:30:45] 메시지`                 |
| `datetime` | `YYYY-MM-DD HH:MM:SS`   | `[develog] [2025-12-27 15:30:45] 메시지`      |
| `iso`      | ISO 8601                | `[develog] [2025-12-27T15:30:45.123Z] 메시지` |
| `ms`       | Unix timestamp (밀리초) | `[develog] [1735308645123] 메시지`            |

### 타임스탬프 유틸리티

```typescript
import { formatTimestamp } from 'develog';

const timestamp = formatTimestamp('datetime');
console.log(timestamp); // '2025-12-27 15:30:45'
```

## 고급 기능

### 그룹 로깅

```typescript
develog.group('사용자 정보');
develog.log('이름: 홍길동');
develog.log('이메일: hong@example.com');
develog.log('역할: 개발자');
develog.groupEnd();

// 접힌 상태로 시작
develog.groupCollapsed('API 요청 상세');
develog.log('URL: https://api.example.com/users');
develog.log('Method: GET');
develog.groupEnd();
```

### 테이블 출력

```typescript
const users = [
  { id: 1, name: '김철수', role: 'Admin' },
  { id: 2, name: '이영희', role: 'User' },
  { id: 3, name: '박민수', role: 'User' },
];

develog.table(users);
```

### 시간 측정

```typescript
develog.time('API 호출');

// 비동기 작업
await fetch('https://api.example.com/data');

develog.timeEnd('API 호출');
// 출력: [develog] API 호출: 245.23ms
```

### 카운터

```typescript
develog.count('클릭 이벤트');
develog.count('클릭 이벤트');
develog.count('클릭 이벤트');
// 출력: [develog] 클릭 이벤트: 3

develog.countReset('클릭 이벤트'); // 카운터 초기화
```

### 콘솔 지우기

```typescript
develog.clear();
```

## API 레퍼런스

### Develog 클래스

#### 생성자

```typescript
new Develog(options?: LoggerOptions)
```

#### 메서드

| 메서드                   | 설명                   |
| ------------------------ | ---------------------- |
| `log(...args)`           | 일반 로그 출력         |
| `info(...args)`          | 정보 로그 출력         |
| `warn(...args)`          | 경고 로그 출력         |
| `error(...args)`         | 에러 로그 출력         |
| `debug(...args)`         | 디버그 로그 출력       |
| `group(label?)`          | 그룹 시작              |
| `groupCollapsed(label?)` | 접힌 그룹 시작         |
| `groupEnd()`             | 그룹 종료              |
| `table(data)`            | 테이블 형식 출력       |
| `time(label)`            | 시간 측정 시작         |
| `timeEnd(label)`         | 시간 측정 종료 및 출력 |
| `count(label?)`          | 실행 횟수 카운트       |
| `countReset(label?)`     | 카운트 초기화          |
| `clear()`                | 콘솔 지우기            |
| `namespace(name)`        | 네임스페이스 로거 생성 |
| `getEnvironment()`       | 현재 환경 반환         |
| `isLoggingEnabled()`     | 로깅 활성화 여부 반환  |

### LoggerOptions

```typescript
interface LoggerOptions {
  // 로깅이 활성화될 환경 목록
  enabledEnvironments?: Environment[]; // 기본값: ['local', 'dev', 'stage']

  // 환경 감지에 사용할 커스텀 hostname 패턴
  customHostnamePatterns?: {
    [key in Environment]?: RegExp;
  };

  // 로그 출력 앞에 붙을 prefix
  prefix?: string; // 기본값: '[develog]'

  // 강제로 환경을 설정 (자동 감지 무시)
  forceEnvironment?: Environment;

  // 타임스탬프 표시 여부
  showTimestamp?: boolean; // 기본값: false

  // 타임스탬프 포맷
  timestampFormat?: TimestampFormat; // 기본값: 'time'

  // 활성화할 네임스페이스 목록
  enabledNamespaces?: string[]; // 기본값: undefined (모두 활성화)
}
```

### 타입 정의

```typescript
type Environment = 'local' | 'dev' | 'stage' | 'production' | 'unknown';
type TimestampFormat = 'time' | 'datetime' | 'iso' | 'ms';
type LogLevel = 'log' | 'info' | 'warn' | 'error' | 'debug';
```

### 유틸리티 함수

```typescript
// 환경 감지
function detectEnvironment(customPatterns?: Partial<Record<Environment, RegExp>>): Environment;

// 타임스탬프 포맷팅
function formatTimestamp(format?: TimestampFormat): string;
```

## 사용 예제

### React 애플리케이션

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
      apiLogger.log('사용자 목록 요청 시작');

      try {
        const response = await fetch('/api/users');
        const users = await response.json();

        apiLogger.info('사용자 목록 로드 완료', users);
        uiLogger.log('UI 렌더링 시작');
      } catch (error) {
        apiLogger.error('사용자 목록 로드 실패', error);
      }
    };

    fetchUsers();
  }, []);

  return <div>...</div>;
}
```

### Next.js 애플리케이션

```typescript
// lib/logger.ts
import { Develog } from 'develog';

// 클라이언트 사이드에서만 동작
export const logger =
  typeof window !== 'undefined'
    ? new Develog({
        prefix: '[NextApp]',
        showTimestamp: true,
      })
    : null;

// 안전한 로깅 헬퍼
export const safeLog = (...args: any[]) => {
  logger?.log(...args);
};
```

### Vue 애플리케이션

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

logger.log('컴포넌트 마운트됨');
</script>
```

### API 클라이언트

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

## 자주 묻는 질문

### Q: 프로덕션 환경에서 완전히 비활성화되나요?

A: 네! 프로덕션 환경에서는 로깅 메서드가 아무 동작도 하지 않으므로, 성능에 영향을 주지 않습니다.

### Q: SSR 환경에서 사용할 수 있나요?

A: 브라우저 환경에서만 동작하도록 설계되었습니다. `window` 객체가 없는 경우 자동으로 `unknown` 환경으로 감지됩니다.

### Q: 기존 로그를 develog로 마이그레이션하려면?

A: 기존 `console.log`를 `develog.log`로 교체하면 됩니다. API가 표준 console과 호환됩니다.

### Q: Tree-shaking이 지원되나요?

A: 네! ESM 번들을 사용하며 Tree-shaking을 지원합니다.

### Q: TypeScript 지원은?

A: 완벽히 지원합니다. 모든 타입 정의가 포함되어 있습니다.

## 기여하기

버그 리포트, 기능 제안, Pull Request를 환영합니다!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 라이센스

MIT License - 자세한 내용은 [LICENSE.md](LICENSE.md) 파일을 참조하세요.

## 링크

- [GitHub Repository](https://github.com/junjuny0227/develog)
- [npm Package](https://www.npmjs.com/package/develog)
- [Issues](https://github.com/junjuny0227/develog/issues)

## 개발자

**junjuny** - [@junjuny0227](https://github.com/junjuny0227)

---

<p align="center">
  Made with love by junjuny
</p>
