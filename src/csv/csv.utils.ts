export const getMonthName = (monthIndex: number) => {
  switch (monthIndex) {
    case 1:
      return 'Styczeń';
    case 2:
      return 'Luty';
    case 3:
      return 'Marzec';
    case 4:
      return 'Kwiecień';
    case 5:
      return 'Maj';
    case 6:
      return 'Czerwiec';
    case 7:
      return 'Lipiec';
    case 8:
      return 'Sierpień';
    case 9:
      return 'Wrzesień';
    case 10:
      return 'Październik';
    case 11:
      return 'Listopad';
    case 12:
      return 'Grudzień';
    default:
      return '';
  }
};

export const formatDate = (dateToFormat: Date) => {
  const date = new Date(dateToFormat);

  const month = date.getMonth() + 1;
  const day = date.getDate();
  const year = date.getFullYear();

  const formattedDate = `${day.toString().padStart(2, '0')}-${month
    .toString()
    .padStart(2, '0')}-${year}`;
  return formattedDate;
};

export const generateListOfDates = (month: number) => {
  const year = new Date().getFullYear();
  const daysInMonth = new Date(year, month, 0).getDate();
  console.log(daysInMonth);

  const dates = [];
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day);
    dates.push(formatDate(date));
  }

  return dates;
};
