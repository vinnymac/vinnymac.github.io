/** Accept known precision only: YYYY, YYYY-MM, or a real YYYY-MM-DD calendar date. */
export const isProjectDate = (value: string): boolean => {
  if (!/^\d{4}(?:-(?:0[1-9]|1[0-2])(?:-(?:0[1-9]|[12]\d|3[01]))?)?$/.test(value)) {
    return false;
  }
  if (value.length < 10) return true;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
};

/** Unknown months/days sort after known dates within the same year/month. */
export const projectDateSortKey = (value: string): number =>
  Number(value.replaceAll('-', '').padEnd(8, '0'));

/** Precise dates are kept in the data; cards display only their year. */
export const projectDateYear = (value: string): number => Number(value.slice(0, 4));
