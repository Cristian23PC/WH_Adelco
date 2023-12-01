import { Schedule, VisitSchedule } from '@/types/BUSalesProfile';
import { mapScheduleToForm, mapFormToSchedule } from './utils';
import { FormValues } from './types';

describe('scheduler utils', () => {
  describe('map schedule object to form values', () => {
    it('gets monthly frequency', () => {
      const scheduleMock = {
        type: 'original',
        schedulingRule: {
          daySelector: {
            tuesday: 514
          },
          frequencyCode: 11
        }
      } as Schedule;
      const formValuesMock = {
        daySelector: 'tuesday',
        frequencyType: 'monthly',
        position: 514,
        noVisit: false,
        biweeklyGroups: undefined,
        monthlyGroups: '11'
      };
      expect(mapScheduleToForm(scheduleMock)).toEqual(formValuesMock);
    });
    it('gets biweekly frequency', () => {
      const scheduleMock = {
        type: 'original',
        schedulingRule: {
          daySelector: {
            tuesday: 514
          },
          frequencyCode: 4
        }
      } as Schedule;
      const formValuesMock = {
        daySelector: 'tuesday',
        frequencyType: 'biweekly',
        position: 514,
        noVisit: false,
        biweeklyGroups: '4',
        monthlyGroups: undefined
      };
      expect(mapScheduleToForm(scheduleMock)).toEqual(formValuesMock);
    });
    it('gets weekly frequency', () => {
      const scheduleMock = {
        type: 'original',
        schedulingRule: {
          daySelector: {
            tuesday: 514
          },
          frequencyCode: 1
        }
      } as Schedule;
      const formValuesMock = {
        daySelector: 'tuesday',
        frequencyType: 'weekly',
        position: 514,
        noVisit: false,
        biweeklyGroups: undefined,
        monthlyGroups: undefined
      };
      expect(mapScheduleToForm(scheduleMock)).toEqual(formValuesMock);
    });
    it('gets no visit option', () => {
      const scheduleMock = {
        type: 'original',
        schedulingRule: {
          frequencyCode: 2
        }
      } as Schedule;
      const formValuesMock = {
        daySelector: undefined,
        frequencyType: undefined,
        position: undefined,
        noVisit: true,
        biweeklyGroups: undefined,
        monthlyGroups: undefined
      };
      expect(mapScheduleToForm(scheduleMock)).toEqual(formValuesMock);
    });
  });
  describe('map form values to schedule', () => {
    it('gets the expected payload for a biweekly frequency', () => {
      const scheduleMock = {
        visitSchedule: {
          type: 'original',
          schedulingRule: {
            daySelector: {
              tuesday: 514
            },
            frequencyCode: 4
          }
        }
      } as VisitSchedule;
      const formValuesMock = {
        daySelector: 'tuesday',
        frequencyType: 'biweekly',
        position: 514,
        noVisit: false,
        biweeklyGroups: '4',
        monthlyGroups: undefined
      } as FormValues;

      expect(mapFormToSchedule(formValuesMock)).toEqual(scheduleMock);
    });
    it('gets the expected payload for a monthly frequency', () => {
      const scheduleMock = {
        visitSchedule: {
          type: 'original',
          schedulingRule: {
            daySelector: {
              tuesday: 514
            },
            frequencyCode: 9
          }
        }
      } as VisitSchedule;
      const formValuesMock = {
        daySelector: 'tuesday',
        frequencyType: 'monthly',
        position: 514,
        noVisit: false,
        biweeklyGroups: undefined,
        monthlyGroups: '9'
      } as FormValues;

      expect(mapFormToSchedule(formValuesMock)).toEqual(scheduleMock);
    });
    it('gets the expected payload for a weekly frequency', () => {
      const scheduleMock = {
        visitSchedule: {
          type: 'original',
          schedulingRule: {
            daySelector: {
              tuesday: 514
            },
            frequencyCode: 1
          }
        }
      } as VisitSchedule;
      const formValuesMock = {
        daySelector: 'tuesday',
        frequencyType: 'weekly',
        position: 514,
        noVisit: false,
        biweeklyGroups: undefined,
        monthlyGroups: undefined
      } as FormValues;

      expect(mapFormToSchedule(formValuesMock)).toEqual(scheduleMock);
    });
    it('gets the expected payload for no visit option', () => {
      const scheduleMock = {
        visitSchedule: {
          type: 'original',
          schedulingRule: {
            frequencyCode: 2
          }
        }
      } as VisitSchedule;
      const formValuesMock = {
        daySelector: undefined,
        frequencyType: undefined,
        position: undefined,
        noVisit: true,
        biweeklyGroups: undefined,
        monthlyGroups: undefined
      } as FormValues;

      expect(mapFormToSchedule(formValuesMock)).toEqual(scheduleMock);
    });
  });
});
