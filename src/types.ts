/**
 * 실행 환경을 나타내는 타입
 */
export type Environment = 'local' | 'dev' | 'stage' | 'production' | 'unknown';

/**
 * 타임스탬프 포맷 타입
 */
export type TimestampFormat = 'time' | 'datetime' | 'iso' | 'ms';

/**
 * Logger 설정 옵션
 */
export interface LoggerOptions {
  /**
   * 로깅이 활성화될 환경 목록
   * @default ['local', 'dev', 'stage']
   */
  enabledEnvironments?: Environment[];

  /**
   * 환경 감지에 사용할 커스텀 hostname 패턴
   */
  customHostnamePatterns?: {
    [key in Environment]?: RegExp;
  };

  /**
   * 로그 출력 앞에 붙을 prefix
   * @default '[develog]'
   */
  prefix?: string;

  /**
   * 강제로 환경을 설정 (자동 감지 무시)
   */
  forceEnvironment?: Environment;

  /**
   * 타임스탬프 표시 여부
   * @default false
   */
  showTimestamp?: boolean;

  /**
   * 타임스탬프 포맷
   * - 'time': HH:MM:SS
   * - 'datetime': YYYY-MM-DD HH:MM:SS
   * - 'iso': ISO 8601 형식
   * - 'ms': Unix timestamp (밀리초)
   * @default 'time'
   */
  timestampFormat?: TimestampFormat;
}

/**
 * 로그 레벨
 */
export type LogLevel = 'log' | 'info' | 'warn' | 'error' | 'debug';
