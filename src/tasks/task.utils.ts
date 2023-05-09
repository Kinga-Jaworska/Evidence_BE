export function setDateRange(month: string) {
  const date = isNaN(Date.parse(month)) ? new Date() : new Date(month);
  const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
  const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 1);

  return { startDate, endDate };
}

export function countDuration(prevValue: string, duration: string) {
  return (Number(prevValue) || 0) + Number(duration);
}
