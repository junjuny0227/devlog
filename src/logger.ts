import { detectEnvironment } from './environment';
import type { Environment, LoggerOptions, LogLevel, TimestampFormat } from './types';
import { formatTimestamp } from './utils';

/**
 * develog - 브라우저 환경 기반 로거
 */
export class Develog {
  private readonly environment: Environment;
  private readonly enabledEnvironments: Set<Environment>;
  private readonly prefix: string;
  private readonly isEnabled: boolean;
  private readonly showTimestamp: boolean;
  private readonly timestampFormat: TimestampFormat;
  private readonly namespaces: Map<string, Develog>;
  private readonly namespaceName?: string;
  private readonly namespaceFilter?: string[];

  constructor(options: LoggerOptions = {}) {
    const {
      enabledEnvironments = ['local', 'dev', 'stage'],
      customHostnamePatterns,
      prefix = '[develog]',
      forceEnvironment,
      showTimestamp = false,
      timestampFormat = 'time',
      enabledNamespaces,
      _namespaceName,
    } = options;

    // 환경 감지
    this.environment = forceEnvironment || detectEnvironment(customHostnamePatterns);
    this.enabledEnvironments = new Set(enabledEnvironments);
    this.prefix = prefix;
    this.showTimestamp = showTimestamp;
    this.timestampFormat = timestampFormat;
    this.namespaces = new Map();
    this.namespaceName = _namespaceName;
    this.namespaceFilter = enabledNamespaces;

    // 환경 기반 활성화 체크
    const envEnabled = this.enabledEnvironments.has(this.environment);

    // 네임스페이스 필터링 체크
    const namespaceEnabled = this.isNamespaceEnabled();

    this.isEnabled = envEnabled && namespaceEnabled;
  }

  /**
   * 현재 감지된 환경을 반환
   */
  getEnvironment(): Environment {
    return this.environment;
  }

  /**
   * 로깅이 활성화되어 있는지 확인
   */
  isLoggingEnabled(): boolean {
    return this.isEnabled;
  }

  /**
   * 네임스페이스별 로거 인스턴스 생성
   * @param name - 네임스페이스 이름
   * @returns 네임스페이스 로거 인스턴스
   */
  namespace(name: string): Develog {
    // 이미 생성된 네임스페이스가 있으면 재사용
    if (this.namespaces.has(name)) {
      return this.namespaces.get(name)!;
    }

    // 계층 구조 지원: 부모 네임스페이스가 있으면 연결
    const fullNamespace = this.namespaceName ? `${this.namespaceName}:${name}` : name;

    // 새로운 네임스페이스 로거 생성
    const namespacedLogger = new Develog({
      enabledEnvironments: Array.from(this.enabledEnvironments),
      prefix: this.prefix,
      forceEnvironment: this.environment,
      showTimestamp: this.showTimestamp,
      timestampFormat: this.timestampFormat,
      enabledNamespaces: this.namespaceFilter,
      _namespaceName: fullNamespace,
    });

    this.namespaces.set(name, namespacedLogger);
    return namespacedLogger;
  }

  /**
   * 현재 네임스페이스가 활성화되어 있는지 확인
   */
  private isNamespaceEnabled(): boolean {
    // 네임스페이스 필터가 없으면 모두 활성화
    if (!this.namespaceFilter || this.namespaceFilter.length === 0) {
      return true;
    }

    // 네임스페이스가 없는 루트 로거는 항상 활성화
    if (!this.namespaceName) {
      return true;
    }

    // '*'는 모든 네임스페이스 활성화
    if (this.namespaceFilter.includes('*')) {
      return true;
    }

    // 정확한 매칭 확인
    if (this.namespaceFilter.includes(this.namespaceName)) {
      return true;
    }

    // 와일드카드 패턴 매칭
    for (const pattern of this.namespaceFilter) {
      if (pattern.endsWith(':*')) {
        const prefix = pattern.slice(0, -2);
        if (this.namespaceName === prefix || this.namespaceName.startsWith(`${prefix}:`)) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * 로그 출력 앞에 붙을 prefix 생성
   */
  private getLogPrefix(): string {
    let prefix = this.prefix;

    // 네임스페이스 추가
    if (this.namespaceName) {
      prefix = `${prefix}:${this.namespaceName}`;
    }

    // 타임스탬프 추가
    if (this.showTimestamp) {
      const timestamp = formatTimestamp(this.timestampFormat);
      prefix = `${prefix} [${timestamp}]`;
    }

    return prefix;
  }

  /**
   * 일반 로그 출력
   */
  log(...args: unknown[]): void {
    this.logWithLevel('log', ...args);
  }

  /**
   * 정보 로그 출력
   */
  info(...args: unknown[]): void {
    this.logWithLevel('info', ...args);
  }

  /**
   * 경고 로그 출력
   */
  warn(...args: unknown[]): void {
    this.logWithLevel('warn', ...args);
  }

  /**
   * 에러 로그 출력
   */
  error(...args: unknown[]): void {
    this.logWithLevel('error', ...args);
  }

  /**
   * 디버그 로그 출력
   */
  debug(...args: unknown[]): void {
    this.logWithLevel('debug', ...args);
  }

  /**
   * 그룹 시작
   */
  group(label?: string): void {
    if (!this.isEnabled) return;
    if (label) {
      console.group(this.formatMessage(label));
    } else {
      console.group();
    }
  }

  /**
   * 그룹 시작 (접혀있는 상태)
   */
  groupCollapsed(label?: string): void {
    if (!this.isEnabled) return;
    if (label) {
      console.groupCollapsed(this.formatMessage(label));
    } else {
      console.groupCollapsed();
    }
  }

  /**
   * 그룹 종료
   */
  groupEnd(): void {
    if (!this.isEnabled) return;
    console.groupEnd();
  }

  /**
   * 테이블 형태로 출력
   */
  table(data: unknown): void {
    if (!this.isEnabled) return;
    console.log(this.getLogPrefix());
    console.table(data);
  }

  /**
   * 시간 측정 시작
   */
  time(label: string): void {
    if (!this.isEnabled) return;
    console.time(this.formatMessage(label));
  }

  /**
   * 시간 측정 종료 및 출력
   */
  timeEnd(label: string): void {
    if (!this.isEnabled) return;
    console.timeEnd(this.formatMessage(label));
  }

  /**
   * 실행 횟수 카운트
   */
  count(label?: string): void {
    if (!this.isEnabled) return;
    if (label) {
      console.count(this.formatMessage(label));
    } else {
      console.count(this.prefix);
    }
  }

  /**
   * 카운트 초기화
   */
  countReset(label?: string): void {
    if (!this.isEnabled) return;
    if (label) {
      console.countReset(this.formatMessage(label));
    } else {
      console.countReset(this.prefix);
    }
  }

  /**
   * 콘솔 지우기
   */
  clear(): void {
    if (!this.isEnabled) return;
    console.clear();
  }

  /**
   * 레벨에 따른 로그 출력
   */
  private logWithLevel(level: LogLevel, ...args: unknown[]): void {
    if (!this.isEnabled) return;

    const consoleMethod = console[level] || console.log;
    const logPrefix = this.getLogPrefix();
    consoleMethod(logPrefix, ...args);
  }

  /**
   * 메시지에 prefix 추가
   */
  private formatMessage(message: string): string {
    const logPrefix = this.getLogPrefix();
    return `${logPrefix} ${message}`;
  }
}

/**
 * 기본 인스턴스 생성 및 export
 */
export const develog = new Develog();
