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

  constructor(options: LoggerOptions = {}) {
    const {
      enabledEnvironments = ['local', 'dev', 'stage'],
      customHostnamePatterns,
      prefix = '[develog]',
      forceEnvironment,
      showTimestamp = false,
      timestampFormat = 'time',
    } = options;

    // 환경 감지
    this.environment = forceEnvironment || detectEnvironment(customHostnamePatterns);
    this.enabledEnvironments = new Set(enabledEnvironments);
    this.prefix = prefix;
    this.isEnabled = this.enabledEnvironments.has(this.environment);
    this.showTimestamp = showTimestamp;
    this.timestampFormat = timestampFormat;
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
    console.log(this.prefix);
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
    const prefixWithTimestamp = this.getPrefixWithTimestamp();
    consoleMethod(prefixWithTimestamp, ...args);
  }

  /**
   * 메시지에 prefix 추가
   */
  private formatMessage(message: string): string {
    const prefixWithTimestamp = this.getPrefixWithTimestamp();
    return `${prefixWithTimestamp} ${message}`;
  }

  /**
   * 타임스탬프가 포함된 prefix 반환
   */
  private getPrefixWithTimestamp(): string {
    if (!this.showTimestamp) {
      return this.prefix;
    }
    const timestamp = formatTimestamp(this.timestampFormat);
    return `${this.prefix} [${timestamp}]`;
  }
}

/**
 * 기본 인스턴스 생성 및 export
 */
export const develog = new Develog();
