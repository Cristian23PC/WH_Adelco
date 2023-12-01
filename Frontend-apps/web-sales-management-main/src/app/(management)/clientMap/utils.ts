import { NextVisit } from '@/types/BUSalesProfile';
import { MapLegendItemProps } from '@adelco/web-components/dist/src/uikit/feedback/MapLegend/MapLegendItem';
import { noVisitCode } from '../clients/partials/visitPlanner/utils';
import { Option } from '@/types/Option';

export const colors = [
  '#FCE300',
  '#FF964A',
  '#FB3E3E',
  '#5AC648',
  '#3E96E8',
  '#9288FF',
  '#ED7BFF'
];

export const noVisitColor = '#CCCCCC';

export const frequencyOptions = {
  days: [
    {
      label: 'Lunes',
      value: 'monday'
    },
    {
      label: 'Martes',
      value: 'tuesday'
    },
    {
      label: 'Miércoles',
      value: 'wednesday'
    },
    {
      label: 'Jueves',
      value: 'thursday'
    },
    {
      label: 'Viernes',
      value: 'friday'
    }
  ],
  groups: {
    weekly: [
      {
        label: 'Semanal',
        value: '1'
      }
    ],
    biweekly: [
      {
        label: 'Bisemanal - A',
        value: '3'
      },
      {
        label: 'Bisemanal - B',
        value: '4'
      }
    ],
    monthly: [
      {
        label: 'Mensual - A',
        value: '8'
      },
      {
        label: 'Mensual - B',
        value: '9'
      },
      {
        label: 'Mensual - C',
        value: '10'
      },
      {
        label: 'Mensual - D',
        value: '11'
      }
    ]
  }
};

const getOptionsByDefault = (): MapLegendItemProps[] => {
  return [{ color: colors[0], label: 'Todos los clientes' }];
};

const getOptionsByDay = () => {
  return frequencyOptions.days.map((day, index) => ({
    color: colors[index % colors.length],
    label: day.label
  }));
};

const getOptionsByGroups = () => {
  return [
    ...frequencyOptions.groups.weekly,
    ...frequencyOptions.groups.biweekly,
    ...frequencyOptions.groups.monthly
  ].map((group, index) => ({
    color: colors[index % colors.length],
    label: group.label
  }));
};

const RECENT_PURCHASE_LABEL = 'Con compra reciente';
const NOT_RECENT_PURCHASE_LABEL = 'Sin compra reciente';
const getOptionsByRecentPurchase = () => {
  return [RECENT_PURCHASE_LABEL, NOT_RECENT_PURCHASE_LABEL].map(
    (opt, index) => ({
      color: colors[index % colors.length],
      label: opt
    })
  );
};

const getOptionsByTerritory = (visits: NextVisit[]) => {
  const territories = visits.reduce(
    (territories: string[], visit: NextVisit) => {
      const territory = territories.find(
        (t) => t === visit.bUSalesProfile.territory.name
      );
      if (!territory) {
        territories.push(visit.bUSalesProfile.territory.name);
      }
      return territories;
    },
    []
  );
  return territories.map((territory, index) => ({
    color: colors[index % colors.length],
    label: territory
  }));
};

const getOptionsByGroupCriteria = (
  criteria: string | null,
  visits: NextVisit[]
) => {
  let opts = getOptionsByDefault();
  if (criteria === 'weekly') {
    opts = getOptionsByDay();
  } else if (criteria === 'groups') {
    opts = getOptionsByGroups();
  } else if (criteria === 'territories') {
    opts = getOptionsByTerritory(visits);
  } else if (criteria === 'recent-purchase') {
    opts = getOptionsByRecentPurchase();
  }
  return opts;
};

const NO_VISIT_LABEL = 'Sin visita';
export const getLegendOptions = (
  groupCriteria: string | null,
  showNoVisit: boolean,
  visits: NextVisit[]
): MapLegendItemProps[] => {
  const options = getOptionsByGroupCriteria(groupCriteria, visits);
  return showNoVisit
    ? [
        ...options,
        { color: noVisitColor, label: NO_VISIT_LABEL, className: 'mt-3' }
      ]
    : options;
};

export const mockCoordinates = [
  { x: -33.32, y: -70.51 },
  { x: -33.39, y: -70.58 },
  { x: -33.44, y: -70.61 },
  { x: -33.47, y: -70.62 },
  { x: -33.53, y: -70.57 },
  { x: -33.56, y: -70.58 },
  { x: -33.58, y: -70.6 },
  { x: -33.62, y: -70.57 },
  { x: -33.66, y: -70.59 },
  { x: -33.7, y: -70.61 },
  { x: -33.55, y: -70.56 },
  { x: -33.56, y: -70.58 },
  { x: -33.63, y: -70.57 },
  { x: -33.64, y: -70.55 },
  { x: -33.65, y: -70.63 },
  { x: -33.31, y: -70.52 },
  { x: -33.37, y: -70.59 },
  { x: -33.42, y: -70.61 },
  { x: -33.45, y: -70.62 },
  { x: -33.51, y: -70.57 },
  { x: -33.54, y: -70.58 },
  { x: -33.56, y: -70.61 },
  { x: -33.61, y: -70.58 },
  { x: -33.65, y: -70.6 },
  { x: -33.69, y: -70.62 },
  { x: -33.53, y: -70.56 },
  { x: -33.54, y: -70.58 },
  { x: -33.61, y: -70.57 },
  { x: -33.62, y: -70.55 },
  { x: -33.63, y: -70.63 }
];

export const getListByFilters = (
  list: NextVisit[],
  filters: string[] | null,
  includeNoVisit: boolean
) => {
  let reducedList = list;

  if (!includeNoVisit) {
    reducedList = reducedList.filter(
      (visit) => visit.frequencyCode.toString() !== noVisitCode
    );
  }
  if (filters) {
    reducedList = reducedList.filter((visit) => {
      const salesRep = visit.bUSalesProfile?.territory?.salesRep?.username;
      if (salesRep) {
        return filters.includes(salesRep);
      }
      return false;
    });
  }
  return reducedList;
};

export const getSalesRepOptions = (visits: NextVisit[]) => {
  return visits.reduce((options: Option[], visit: NextVisit) => {
    const salesRep = options.find(
      (opt) => opt.value === visit.bUSalesProfile.territory?.salesRep?.username
    );
    if (!salesRep) {
      const name = [
        visit.bUSalesProfile.territory?.salesRep?.firstName,
        visit.bUSalesProfile.territory?.salesRep?.lastName
      ].join(' ');
      options.push({
        label: name,
        value: visit.bUSalesProfile.territory?.salesRep.username ?? ''
      });
    }
    return options;
  }, []);
};

export const getColorByGroupCriteria = (
  criteria: string | null,
  visit: NextVisit,
  legendOptions: MapLegendItemProps[]
) => {
  let color = colors[0];
  if (criteria === 'weekly') {
    const label = frequencyOptions.days.find(
      (opt) => opt.value === visit.daySelector
    )?.label;
    const option = legendOptions.find((opt) => opt.label === label)?.color;
    color = option ?? color;
  } else if (criteria === 'groups') {
    const label = [
      ...frequencyOptions.groups.weekly,
      ...frequencyOptions.groups.biweekly,
      ...frequencyOptions.groups.monthly
    ].find((opt) => opt.value === visit.frequencyCode.toString())?.label;
    const option = legendOptions.find((opt) => opt.label === label)?.color;
    color = option ?? color;
  } else if (criteria === 'territories') {
    const option = legendOptions.find(
      (opt) => opt.label === visit.bUSalesProfile.territory.name
    )?.color;
    color = option ?? color;
  } else if (criteria === 'recent-purchase') {
    const lastOrder = visit.bUSalesProfile.lastOrderDate ?? null;
    if (lastOrder) {
      const label =
        new Date(lastOrder).getMonth() === new Date().getMonth()
          ? RECENT_PURCHASE_LABEL
          : NOT_RECENT_PURCHASE_LABEL;
      const option = legendOptions.find((opt) => opt.label === label)?.color;
      color = option ?? color;
    } else {
      color = colors[1];
    }
  }
  if (visit.frequencyCode.toString() === noVisitCode) {
    color = noVisitColor;
  }

  return color;
};

const COORDINATES_RANGE = [
  { x: -55.57541716394262, y: -76.52157727664907 },
  { x: -17.3061856091726, y: -65.49017784786983 }
];
export const isInCoordinateRange = (
  coordinates: { x: number; y: number } | undefined
): boolean => {
  if (!coordinates) return false;

  const [minLat, maxLat] = [COORDINATES_RANGE[0].x, COORDINATES_RANGE[1].x];
  const [minLng, maxLng] = [COORDINATES_RANGE[0].y, COORDINATES_RANGE[1].y];

  return (
    coordinates.x > minLat &&
    coordinates.x < maxLat &&
    coordinates.y > minLng &&
    coordinates.y < maxLng
  );
};
