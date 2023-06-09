import { format } from 'date-fns';

export const getMonthName = (monthIndex: number) => {
  switch (monthIndex) {
    case 1:
      return 'Styczen';
    case 2:
      return 'Luty';
    case 3:
      return 'Marzec';
    case 4:
      return 'Kwiecien';
    case 5:
      return 'Maj';
    case 6:
      return 'Czerwiec';
    case 7:
      return 'Lipiec';
    case 8:
      return 'Sierpien';
    case 9:
      return 'Wrzesien';
    case 10:
      return 'Pazdziernik';
    case 11:
      return 'Listopad';
    case 12:
      return 'Grudzien';
    default:
      return '';
  }
};

export const generateListOfDates = (month: number) => {
  const year = new Date().getFullYear();
  const daysInMonth = new Date(year, month, 0).getDate();

  const dates = [];
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day);
    dates.push(format(date, 'dd-MM-yyyy'));
  }

  return dates;
};

export function getMonthIndex(date: Date) {
  return date.getMonth() + 1;
}

export const changeDurationFormatToString = (duration: number) => {
  if (duration < 60) return `${duration % 60}m`;
  else
    return duration % 60 != 0
      ? `${Math.floor(duration / 60)}h${duration % 60}m`
      : `${Math.floor(duration / 60)}h`;
};
