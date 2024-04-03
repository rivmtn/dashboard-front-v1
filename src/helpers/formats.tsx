export function formatDate(dateStr: string) {
  const year = dateStr.substring(2, 4);
  const month = dateStr.substring(4, 6);
  const day = dateStr.substring(6);
  return `${year}.${month}.${day}`;
}

export function formatStringToDate(dateStr: string): Date {
  const year = dateStr.substring(0, 4);
  const month = dateStr.substring(4, 6);
  const day = dateStr.substring(6);
  return new Date(`${year}-${month}-${day}`);
}

export const formatDateToString = (date: Date): string => {
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}${month}${day}`;
};

export function formatNumber(num: number | string) {
  return Number(num).toLocaleString("ko-KR");
}
