const getDayMonth = ({ date }: { date: Date | string }): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const currentYear = new Date().getFullYear();
  const dateYear = dateObj.getFullYear();
  
  const months = [
    'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
    'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'
  ];
  
  const month = months[dateObj.getMonth()];
  const day = dateObj.getDate();
  
  const getOrdinalSuffix = (num: number): string => {
    const j = num % 10;
    const k = num % 100;
    if (j === 1 && k !== 11) return `${num}ST`;
    if (j === 2 && k !== 12) return `${num}ND`;
    if (j === 3 && k !== 13) return `${num}RD`;
    return `${num}TH`;
  };
  
  const dayWithSuffix = getOrdinalSuffix(day);
  if (dateYear < currentYear) {
    return `${month} ${dayWithSuffix} ${dateYear}`;
  }
  
  return `${month} ${dayWithSuffix}`;
};

const getTime = ({ date }: { date: Date | string }): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  let hours = dateObj.getHours();
  const minutes = dateObj.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 should be 12
  
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  
  return `${hours}:${formattedMinutes}${ampm}`;
};

const isSameDay = ({ date1, date2 }: { date1: Date | string, date2: Date | string }): boolean => {
  const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
  const d2 = typeof date2 === 'string' ? new Date(date2) : date2;
  
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

const isWithinTwoDays = ({ date }: { date: Date | string }): boolean => {
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const twoDaysAgo = new Date(now.getTime() - (2 * 24 * 60 * 60 * 1000));
  
  return targetDate >= twoDaysAgo && targetDate <= now;
};

const getRelativeTime = ({ date }: { date: Date | string }): string => {
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - (24 * 60 * 60 * 1000));
  const twoDaysAgo = new Date(today.getTime() - (2 * 24 * 60 * 60 * 1000));
  
  // Reset target date to start of day for comparison
  const targetDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
  
  if (isSameDay({ date1: targetDate, date2: today })) {
    return 'TODAY';
  } else if (isSameDay({ date1: targetDate, date2: yesterday })) {
    return 'YESTERDAY';
  } else if (isSameDay({ date1: targetDate, date2: twoDaysAgo })) {
    return '2 DAYS AGO';
  } else {
    return getDayMonth({date});
  }
};

export { getDayMonth, getTime, isSameDay, isWithinTwoDays, getRelativeTime };
