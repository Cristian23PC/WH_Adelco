import {
  Schedule,
  SchedulingRule,
  VisitSchedule
} from '@/types/BUSalesProfile';
import {
  WeekDay,
  BiweeklyGroup,
  FormValues,
  MonthlyGroup,
  FrequencyType
} from './types';

type GroupFrequencyType = '1' | '3' | '4' | '8' | '9' | '10' | '11';
export const frequencyTypes: FrequencyType[] = [
  'weekly',
  'biweekly',
  'monthly'
];
export const noVisitCode = '2';
export const weeklyCode = '1';
export const biweeklyGroups: BiweeklyGroup[] = ['3', '4'];
export const monthlyGroups: MonthlyGroup[] = ['8', '9', '10', '11'];
export const weekDays: WeekDay[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday'
];

const frequencyType = {
  '1': 'weekly',
  '3': 'biweekly',
  '4': 'biweekly',
  '8': 'monthly',
  '9': 'monthly',
  '10': 'monthly',
  '11': 'monthly'
};

export const isBiweeklyGroups = (code: number): boolean => {
  return biweeklyGroups.includes(code.toString() as BiweeklyGroup);
};

export const isMonthlyGroups = (code: number): boolean => {
  return monthlyGroups.includes(code.toString() as MonthlyGroup);
};

export const mapScheduleToForm = (schedule: Schedule): FormValues => {
  const daySelected = schedule.schedulingRule.daySelector
    ? (Object.keys(
        schedule.schedulingRule.daySelector
      )[0] as FormValues['daySelector'])
    : undefined;
  const position =
    schedule.schedulingRule.daySelector && daySelected
      ? schedule.schedulingRule.daySelector[daySelected]
      : undefined;
  const { frequencyCode } = schedule.schedulingRule;
  const isBiweekly = isBiweeklyGroups(frequencyCode);
  const isMonthly = isMonthlyGroups(frequencyCode);

  return {
    daySelector: daySelected,
    frequencyType:
      frequencyCode && frequencyType.hasOwnProperty(frequencyCode.toString())
        ? (frequencyType[
            frequencyCode.toString() as GroupFrequencyType
          ] as FormValues['frequencyType'])
        : undefined,
    position,
    noVisit: Boolean(frequencyCode === 2),
    biweeklyGroups: isBiweekly
      ? (frequencyCode.toString() as FormValues['biweeklyGroups'])
      : undefined,
    monthlyGroups: isMonthly
      ? (frequencyCode.toString() as FormValues['monthlyGroups'])
      : undefined
  };
};

export const getFrequencyCode = (formData: FormValues): number => {
  /* default value = no visit */
  let code = 2;
  if (!formData.noVisit && formData.frequencyType) {
    const frequency = {
      weekly: 1,
      biweekly: formData.biweeklyGroups
        ? parseInt(formData.biweeklyGroups)
        : undefined,
      monthly: formData.monthlyGroups
        ? parseInt(formData.monthlyGroups)
        : undefined
    };
    code = frequency[formData.frequencyType] ?? 2;
  }
  return code;
};

export const mapFormToSchedule = (formData: FormValues): VisitSchedule => {
  const frequencyCode = getFrequencyCode(formData);
  let daySelector: SchedulingRule['daySelector'];
  if (formData.daySelector) {
    daySelector = {
      [formData.daySelector]: formData.position
    } as SchedulingRule['daySelector'];
  }
  const schedulingRule = daySelector
    ? { daySelector, frequencyCode }
    : { frequencyCode };
  return {
    visitSchedule: {
      type: 'original',
      schedulingRule
    }
  };
};
