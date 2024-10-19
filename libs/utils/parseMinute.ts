import { format } from 'date-fns';

export function parseMinutes(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = Math.round(minutes % 60);
  if (hours <= 0) {
    return remainingMinutes + 'm';
  }

  return `${hours}h ${remainingMinutes}m`;
}

export function computeTriviaMinutes(duration: string): number {
  if (!duration) {
    return 0;
  }

  const totalSeconds = Number(duration);
  const totalMinutes = totalSeconds / 60;
  return totalMinutes;
}

export const formatDate = (date: Date): string => {
  return format(date, 'dd MMM, yyyy');
};
