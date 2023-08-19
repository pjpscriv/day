// For all yah little helper methods

export function getDayMilliseconds(date: Date): number {
  let ms = date.getHours()*60*60*1000;
  ms += date.getMinutes()*60*1000;
  ms += date.getSeconds()*1000;
  ms += date.getMilliseconds();
  return ms;
}
