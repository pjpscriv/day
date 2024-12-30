import { MS_PER_DAY } from "../day.consts";
import * as SunCalc from "suncalc";
import { Place } from "./place.type";

export type SunTimesType = SunCalc.GetTimesResult;

export const startingTime: SunTimesType = {
  dawn: new Date(NaN),
  dusk: new Date(NaN),
  goldenHour: new Date(NaN),
  goldenHourEnd: new Date(NaN),
  nadir: new Date(NaN),
  nauticalDawn: new Date(NaN),
  nauticalDusk: new Date(NaN),
  night: new Date(NaN),
  nightEnd: new Date(NaN),
  solarNoon: new Date(NaN),
  sunrise: new Date(NaN),
  sunriseEnd: new Date(NaN),
  sunset: new Date(NaN),
  sunsetStart: new Date(NaN),
};

export type SunTimeDisplayData = {
  time: Date | null,
  position: string
}

export type SunTimeDisplayDataWithIcon = {
  time: Date,
  position: string,
  dotPosition: string
}

export type SunTimesDisplayData = {
  sunrise: SunTimeDisplayData,
  sunset: SunTimeDisplayData,
  solarNoon: SunTimeDisplayDataWithIcon,
  nadir: SunTimeDisplayDataWithIcon
}

export function hasSunriseAndSunset(sunTimes: SunTimesType): boolean {
  return !isNaN(sunTimes.sunrise?.getTime()) && !isNaN(sunTimes.sunset.getTime());
}

export function dayLongerThanNight(sunTimes: SunTimesType): boolean {
  return (sunTimes.sunset.getTime() - sunTimes.sunrise.getTime()) > (MS_PER_DAY / 2);
}

export function convertToPlaceTimes(sunTimes: SunTimesType, place: Place): SunTimesType {
  const offset = place.utcOffset - (new Date().getTimezoneOffset() * -1);
  const msOffset = offset * 60 * 1000;

  let newSunTimes = { ...sunTimes };
  for (let key in newSunTimes) {
    let newKey = key as keyof SunTimesType;
    newSunTimes[newKey] = new Date(newSunTimes[newKey].getTime() + msOffset);
  }

  return newSunTimes;
}
