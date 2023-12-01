export type WeekDay =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday';

export type FrequencyType = 'weekly' | 'biweekly' | 'monthly';
export type BiweeklyGroup = '3' | '4';
export type MonthlyGroup = '8' | '9' | '10' | '11';

export type FormValues = {
  noVisit?: boolean;
  daySelector?: WeekDay;
  frequencyType?: FrequencyType;
  position?: number;
  biweeklyGroups?: BiweeklyGroup;
  monthlyGroups?: MonthlyGroup;
};

export type FormFields =
  | 'daySelector'
  | 'frequencyType'
  | 'position'
  | 'noVisit'
  | 'biweeklyGroups'
  | 'monthlyGroups';
