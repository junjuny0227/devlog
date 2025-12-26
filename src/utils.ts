import type { TimestampFormat } from './types';

/**
 * 현재 시간을 지정된 포맷으로 변환
 * @param format - 타임스탬프 포맷
 * @returns 포맷된 타임스탬프 문자열
 */
export function formatTimestamp(format: TimestampFormat = 'time'): string {
  const now = new Date();

  switch (format) {
    case 'time':
      return formatTime(now);
    case 'datetime':
      return formatDateTime(now);
    case 'iso':
      return now.toISOString();
    case 'ms':
      return now.getTime().toString();
    default:
      return formatTime(now);
  }
}

/**
 * HH:MM:SS 포맷
 */
function formatTime(date: Date): string {
  const hours = padZero(date.getHours());
  const minutes = padZero(date.getMinutes());
  const seconds = padZero(date.getSeconds());
  return `${hours}:${minutes}:${seconds}`;
}

/**
 * YYYY-MM-DD HH:MM:SS 포맷
 */
function formatDateTime(date: Date): string {
  const year = date.getFullYear();
  const month = padZero(date.getMonth() + 1);
  const day = padZero(date.getDate());
  const timeStr = formatTime(date);
  return `${year}-${month}-${day} ${timeStr}`;
}

/**
 * 숫자를 두 자리로 패딩
 */
function padZero(num: number): string {
  return num.toString().padStart(2, '0');
}
