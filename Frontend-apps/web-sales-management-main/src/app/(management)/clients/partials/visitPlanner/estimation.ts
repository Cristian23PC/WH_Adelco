import { SchedulingRule } from '@/types/BUSalesProfile';
import { WeekDay } from './types';

const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const dateFrom = (date: Date, value: number): Date => {
  if (date instanceof Date) {
    return new (date.constructor as DateConstructor)(value);
  } else {
    return new Date(value);
  }
};

const getWeekYear = (dirtyDate: Date, options?: any): number => {
  const date = toDate(dirtyDate);
  const year = date.getFullYear();
  const firstWeekContainsDate =
    options?.firstWeekContainsDate ??
    options?.locale?.options?.firstWeekContainsDate ??
    1;
  const firstWeekOfNextYear = dateFrom(dirtyDate, 0);
  firstWeekOfNextYear.setFullYear(year + 1, 0, firstWeekContainsDate);
  firstWeekOfNextYear.setHours(0, 0, 0, 0);
  const startOfNextYear = startOfWeek(firstWeekOfNextYear, options);

  const firstWeekOfThisYear = dateFrom(dirtyDate, 0);
  firstWeekOfThisYear.setFullYear(year, 0, firstWeekContainsDate);
  firstWeekOfThisYear.setHours(0, 0, 0, 0);
  const startOfThisYear = startOfWeek(firstWeekOfThisYear, options);

  if (date.getTime() >= startOfNextYear.getTime()) {
    return year + 1;
  } else if (date.getTime() >= startOfThisYear.getTime()) {
    return year;
  } else {
    return year - 1;
  }
};

const startOfWeekYear = (dirtyDate: Date, options?: any): Date => {
  const firstWeekContainsDate =
    options?.firstWeekContainsDate ??
    options?.locale?.options?.firstWeekContainsDate ??
    1;

  const year = getWeekYear(dirtyDate, options);
  const firstWeek = dateFrom(dirtyDate, 0);
  firstWeek.setFullYear(year, 0, firstWeekContainsDate);
  firstWeek.setHours(0, 0, 0, 0);
  const date = startOfWeek(firstWeek, options);
  return date;
};

const startOfWeek = (dirtyDate: Date, options?: any): Date => {
  const weekStartsOn =
    options?.weekStartsOn ?? options?.locale?.options?.weekStartsOn ?? 0;
  const date = toDate(dirtyDate);
  const day = date.getDay();
  const diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;
  date.setDate(date.getDate() - diff);
  date.setHours(0, 0, 0, 0);
  return date;
};

const toDate = (argument: any): Date => {
  const argStr = Object.prototype.toString.call(argument);
  if (
    argument instanceof Date ||
    (typeof argument === 'object' && argStr === '[object Date]')
  ) {
    return new (argument.constructor as DateConstructor)(argument.getTime());
  } else if (typeof argument === 'number' || argStr === '[object Number]') {
    return new Date(argument);
  } else {
    return new Date(NaN);
  }
};

const millisecondsInWeek = 604800000;

const getWeek = (dirtyDate: Date, options?: any): number => {
  const date = toDate(dirtyDate);
  const diff =
    startOfWeek(date, options).getTime() -
    startOfWeekYear(date, options).getTime();
  return Math.round(diff / millisecondsInWeek) + 1;
};

const getDay = (date: Date): number => {
  return date.getDay();
};

const daysOfWeek = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday'
];

const noVisitsFrequencyCode = 2;

export const generateVisits = (
  { schedulingRule }: { schedulingRule: SchedulingRule },
  VISITS_TO_GENERATE: number
): Array<{ time: Date; sequence: number }> => {
  const frequencyCode = schedulingRule.frequencyCode;

  if (frequencyCode === noVisitsFrequencyCode || !schedulingRule.daySelector) {
    return [];
  }

  const daySelectors = Object.keys(schedulingRule.daySelector).map((day) =>
    day.toLowerCase()
  );

  const now = new Date();
  let nextVisitDate = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      12,
      0,
      0
    )
  );

  const endDate = addDays(nextVisitDate, VISITS_TO_GENERATE);
  const visits: Array<{ time: Date; sequence: number }> = [];

  do {
    const nextVisitDayName = daysOfWeek[getDay(nextVisitDate)];
    if (
      daySelectors.includes(nextVisitDayName) &&
      isValidVisitDay(nextVisitDate, frequencyCode) &&
      nextVisitDate <= endDate
    ) {
      visits.push({
        time: nextVisitDate,
        sequence: schedulingRule?.daySelector[nextVisitDayName as WeekDay] ?? 0
      });
    }
    nextVisitDate = addDays(nextVisitDate, 1);
  } while (nextVisitDate <= endDate);

  return visits;
};

const isValidVisitDay = (date: Date, frequencyCode: number): boolean => {
  const currentWeek = getWeek(date, { weekStartsOn: 1 });
  const { visitFrequency, startWeek } = getFrequencyAndStartWeek(frequencyCode);
  return (currentWeek - startWeek) % visitFrequency === 0;
};

const getFrequencyAndStartWeek = (
  frequencyCode: number
): {
  visitFrequency: number;
  startWeek: number;
} => {
  let visitFrequency = 1;
  let startWeek = 1;

  const startWeekOne = [1, 3, 5, 8];
  const startWeekTwo = [4, 6, 9];
  const startWeekThree = [7, 10];
  const startWeekFour = [11];
  const frequencyTwo = [3, 4];
  const frequencyThree = [5, 6, 7];
  const frequencyFour = [8, 9, 10, 11];

  if (frequencyTwo.includes(frequencyCode)) {
    visitFrequency = 2;
  }
  if (frequencyThree.includes(frequencyCode)) {
    visitFrequency = 3;
  }
  if (frequencyFour.includes(frequencyCode)) {
    visitFrequency = 4;
  }

  if (startWeekOne.includes(frequencyCode)) {
    startWeek = 1;
  }
  if (startWeekTwo.includes(frequencyCode)) {
    startWeek = 2;
  }
  if (startWeekThree.includes(frequencyCode)) {
    startWeek = 3;
  }
  if (startWeekFour.includes(frequencyCode)) {
    startWeek = 4;
  }

  return { visitFrequency, startWeek };
};
