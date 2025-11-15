export function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

export function getDaysDifference(date1: string, date2: string): number {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = d2.getTime() - d1.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

export function isToday(dateString: string): boolean {
  return dateString.split('T')[0] === getTodayString();
}

export function isYesterday(dateString: string): boolean {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return dateString.split('T')[0] === yesterday.toISOString().split('T')[0];
}

export function calculateActiveDaysStreak(lastAccessDate: string | null, currentStreak: number): number {
  if (!lastAccessDate) {
    return 1;
  }

  const today = getTodayString();
  const lastAccess = lastAccessDate.split('T')[0];

  if (lastAccess === today) {
    return currentStreak;
  }

  const daysDiff = getDaysDifference(lastAccess, today);

  if (daysDiff === 1) {
    return currentStreak + 1;
  }

  if (daysDiff > 1) {
    return 1;
  }

  return currentStreak;
}
