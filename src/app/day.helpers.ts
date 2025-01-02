// For all yah little helper methods

export function getDayMilliseconds(date: Date): number {
  let ms = date.getHours()*60*60*1000;
  ms += date.getMinutes()*60*1000;
  ms += date.getSeconds()*1000;
  ms += date.getMilliseconds();
  return ms;
}

export function getNZUtcOffset() {
  const now = new Date();
  const year = now.getFullYear();

  // Get the last Sunday in September
  const startOfDST = new Date(year, 8, 30); // September 30
  while (startOfDST.getDay() !== 0) {
      startOfDST.setDate(startOfDST.getDate() - 1);
  }

  // Get the first Sunday in April
  const endOfDST = new Date(year, 3, 1); // April 1
  while (endOfDST.getDay() !== 0) {
      endOfDST.setDate(endOfDST.getDate() + 1);
  }

  const isDST = now < endOfDST || startOfDST <= now;
  const utcOffSet = isDST ? (13 * 60) : (12 * 60);

  return utcOffSet;
}
