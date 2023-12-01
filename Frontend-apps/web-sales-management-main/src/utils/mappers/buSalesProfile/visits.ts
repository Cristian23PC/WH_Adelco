import { NextVisit, NextVisitPageResult } from '@/types/BUSalesProfile';
import { MapVisit } from '@/components/ClientMap/types';
import {
  noVisitCode,
  weeklyCode,
  isBiweeklyGroups,
  isMonthlyGroups
} from '@/app/(management)/clients/partials/visitPlanner/utils';
import { frequencyOptions } from '@/app/(management)/clientMap/utils';

const getVisitGroup = (frequencyCode: number): string => {
  let visitGroup = '';
  if (isBiweeklyGroups(frequencyCode)) {
    visitGroup =
      frequencyOptions.groups.biweekly.find(
        (group) => group.value === frequencyCode.toString()
      )?.label ?? '';
  } else if (isMonthlyGroups(frequencyCode)) {
    visitGroup =
      frequencyOptions.groups.monthly.find(
        (group) => group.value === frequencyCode.toString()
      )?.label ?? '';
  } else if (weeklyCode === frequencyCode.toString()) {
    visitGroup = frequencyOptions.groups.weekly[0].label;
  }
  return visitGroup;
};
export const mapBUNextVisitsToMapVisits = (
  visit: NextVisit,
  color: string
): MapVisit => {
  const salesRepName = [
    visit.bUSalesProfile?.territory?.salesRep?.firstName,
    visit.bUSalesProfile?.territory?.salesRep?.lastName
  ].join(' ');

  const visitDay = frequencyOptions.days.find(
    (day) => day.value === visit.daySelector
  );
  const lastOrderMonth = visit.bUSalesProfile.lastOrderDate
    ? new Date(visit.bUSalesProfile.lastOrderDate).getMonth()
    : null;
  return {
    frequencyCode: visit.frequencyCode,
    date: new Date(visit.time),
    color,
    businessInfo: {
      coordinates: visit.bUSalesProfile?.coordinates
        ? {
            lat: visit.bUSalesProfile?.coordinates?.x,
            lng: visit.bUSalesProfile?.coordinates?.y
          }
        : undefined,
      name: visit.bUSalesProfile?.name,
      tradeName: visit.bUSalesProfile?.name, // tradeName not in schema TODO: get when backend includes
      rut: '', // This property doesn't exist in the current schema TODO: get when backend includes
      territoryName: visit.bUSalesProfile?.territory?.name,
      address: '', // This property doesn't exist in the current schema TODO: get when backend includes
      visitGroup: getVisitGroup(visit.frequencyCode),
      visitDay: visitDay?.label ?? '',
      salesRepName: salesRepName,
      recentPurchases: lastOrderMonth === new Date().getMonth(),
      noVisit: visit.frequencyCode.toString() === noVisitCode
    }
  };
};
