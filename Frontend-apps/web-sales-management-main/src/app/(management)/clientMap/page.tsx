'use client';
import { useEffect, useState } from 'react';
import SidebarFilter from '@/components/SidebarFilter/SidebarFilter';
import ClientMap from '@/components/ClientMap/ClientMap';
import useBUNextVisits from '@/hooks/BUSalesProfile/useBUNextVisits';
import { mapBUNextVisitsToMapVisits } from '@/utils/mappers/buSalesProfile/visits';
import { MapVisit } from '@/components/ClientMap/types';
import {
  getLegendOptions,
  mockCoordinates,
  getListByFilters,
  getSalesRepOptions,
  getColorByGroupCriteria,
  isInCoordinateRange
} from './utils';
import { MapLegendItemProps } from '@adelco/web-components/dist/src/uikit/feedback/MapLegend/MapLegendItem';
import { Option } from '@/types/Option';

const ClientMapPage = () => {
  const { nextVisits, setTime } = useBUNextVisits();
  const [salesRepFilter, setSalesRepFilter] = useState<string[] | null>(null);
  const [groupCriteria, setGroupCriteria] = useState<string | null>(null);
  const [visits, setVisits] = useState<MapVisit[]>([]);
  const [includeNoVisits, setIncludeNoVisits] = useState(false);
  const [legendOptions, setLegendOptions] = useState<MapLegendItemProps[]>([]);
  const [salesRepOptions, setSalesRepOptions] = useState<Option[]>([]);

  useEffect(() => {
    if (nextVisits?.results?.length) {
      /* remove possible visit without enough data */
      const reducedList = nextVisits?.results.filter(
        (visit) =>
          visit.frequencyCode &&
          visit.bUSalesProfile?.territory?.salesRep?.username &&
          isInCoordinateRange(visit.bUSalesProfile.coordinates)
      );
      const filteredList = getListByFilters(
        reducedList,
        salesRepFilter,
        includeNoVisits
      );
      const options = getLegendOptions(
        groupCriteria,
        includeNoVisits,
        filteredList
      );
      setLegendOptions(options);

      const list = filteredList.map((visit, index) => {
        /* Mock coordinates TODO: remove mock when backend is fixed */
        const { bUSalesProfile, ...rest } = visit;
        const buCoordinates = bUSalesProfile?.coordinates;
        const visitObject = {
          bUSalesProfile: {
            ...bUSalesProfile,
            coordinates:
              buCoordinates ?? mockCoordinates[index % mockCoordinates.length]
          },
          ...rest
        };
        /* end mock coordinates */
        const color = getColorByGroupCriteria(groupCriteria, visit, options);
        return mapBUNextVisitsToMapVisits(visitObject, color);
      });

      setVisits(list);

      const sellers = getSalesRepOptions(reducedList);
      setSalesRepOptions(sellers);
    } else {
      setVisits([]);
    }
  }, [nextVisits, groupCriteria, includeNoVisits, salesRepFilter]);

  const handleChangeIncludeNoVisits = (value: boolean) => {
    setIncludeNoVisits(value);
  };

  const handleChangeDateFilter = (value: Date | undefined) => {
    const formattedDate = value?.toLocaleString('en-CA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    setTime(formattedDate);
  };

  const handleChangeSalesRep = (data: string[] | null) => {
    setSalesRepFilter(data);
    if (!data?.length) {
      setSalesRepFilter(null);
    }
  };

  const handleChangeGroupCriteria = (data: string | null) => {
    setGroupCriteria(data);
  };

  return (
    <main className="grid grid-cols-[1fr,203px] gap-6">
      <ClientMap visits={visits} />
      <SidebarFilter
        legendOptions={legendOptions}
        onChangeNoVisit={handleChangeIncludeNoVisits}
        salesRepOptions={salesRepOptions}
        onChangeDateFilter={handleChangeDateFilter}
        onChangeSalesRep={handleChangeSalesRep}
        onChangeGroupCriteria={handleChangeGroupCriteria}
        onReset={() => setTime(undefined)}
      />
    </main>
  );
};

export default ClientMapPage;
