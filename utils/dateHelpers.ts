// Get start of day
export const startOfDay = (date: Date): Date => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  return start;
};

// Get end of day
export const endOfDay = (date: Date): Date => {
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);
  return end;
};

// Get start of week (Sunday)
export const startOfWeek = (date: Date): Date => {
  const start = new Date(date);
  const day = start.getDay(); // 0 = Sunday, 1 = Monday, etc.
  start.setDate(start.getDate() - day);
  start.setHours(0, 0, 0, 0);
  return start;
};

// Get end of week (Saturday)
export const endOfWeek = (date: Date): Date => {
  const end = new Date(date);
  const day = end.getDay(); // 0 = Sunday, 1 = Monday, etc.
  end.setDate(end.getDate() + (6 - day));
  end.setHours(23, 59, 59, 999);
  return end;
};

// Get start of month
export const startOfMonth = (date: Date): Date => {
  const start = new Date(date);
  start.setDate(1);
  start.setHours(0, 0, 0, 0);
  return start;
};

// Get end of month
export const endOfMonth = (date: Date): Date => {
  const end = new Date(date);
  end.setMonth(end.getMonth() + 1);
  end.setDate(0);
  end.setHours(23, 59, 59, 999);
  return end;
};

// Format date as YYYY-MM-DD
export const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Format time as HH:MM
export const formatTime = (date: Date): string => {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

// Get days of week (Sunday to Saturday)
export const getDaysOfWeek = (): string[] => {
  return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
};

// Check if two dates are the same day
export const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

// Get relative date string (Today, Yesterday, or formatted date)
export const getRelativeDateString = (date: Date): string => {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (isSameDay(date, today)) {
    return 'Today';
  } else if (isSameDay(date, yesterday)) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString(undefined, {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  }
};

export default {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  formatDate,
  formatTime,
  getDaysOfWeek,
  isSameDay,
  getRelativeDateString
};