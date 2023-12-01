'use client';
import React, { FC, useState } from 'react';
import {
  Icon,
  Switch,
  OptionRadio,
  Button,
  DatePicker,
  MapLegend,
  DropdownMultiselect
} from '@adelco/web-components';
import filterOptions from './filterOptions.json';
import { MapLegendItemProps } from '@adelco/web-components/dist/src/uikit/feedback/MapLegend/MapLegendItem';
import { Option } from '@/types/Option';

export interface SideBarFilterProps {
  legendOptions?: MapLegendItemProps[];
  salesRepOptions?: Option[];
  onChangeNoVisit: (value: boolean) => void;
  onChangeDateFilter: (date: Date | undefined) => void;
  onChangeSalesRep: (data: string[] | null) => void;
  onChangeGroupCriteria: (data: string | null) => void;
  onReset: () => void;
}

const SidebarFilter: FC<SideBarFilterProps> = ({
  legendOptions = [],
  salesRepOptions = [],
  onChangeNoVisit,
  onChangeDateFilter,
  onChangeSalesRep,
  onChangeGroupCriteria,
  onReset
}) => {
  const [dateSelected, setDateSelected] = useState<Date | undefined>(undefined);
  const [sellersSelected, setSellersSelected] = useState<string[] | undefined>(
    undefined
  );
  const [includeNoVisits, setIncludeNoVisits] = useState(false);
  const [filterOptionValue, setFilterOptionValue] = useState<
    string | undefined
  >(undefined);

  const handleReset = () => {
    setDateSelected(undefined);
    setSellersSelected([]);
    setFilterOptionValue(undefined);
    onChangeSalesRep(null);
    onChangeGroupCriteria(null);
    setIncludeNoVisits(false);
    onChangeNoVisit(false);
    onReset();
  };

  const title = sellersSelected?.length
    ? `Vendedor (${sellersSelected?.length})`
    : 'Vendedor';

  return (
    <div className="flex flex-col gap-4 text-xs font-sans">
      {/* Filter */}
      <div className="rounded-2xl bg-white p-4">
        <div className="flex gap-1 items-center w-full pb-4">
          <Icon name="map" width={16} height={16} />
          <span className="text-sm font-bold">Mapa de clientes</span>
        </div>
        <div className="py-2">
          <span>Filtrar clientes por:</span>
        </div>
        <div className="flex flex-col gap-2">
          <DatePicker
            allowPastDates={false}
            onChange={(date) => {
              setDateSelected(date);
              onChangeDateFilter(date);
            }}
            date={dateSelected}
          />
          <DropdownMultiselect
            title={title}
            placeholder="Buscar vendedor"
            isSearchable
            value={sellersSelected}
            options={salesRepOptions}
            onChange={(data) => {
              setSellersSelected(data);
              onChangeSalesRep(data);
            }}
          />
        </div>
        <div className="flex relative items-center justify-between gap-1 py-2">
          <span className="tracking-tight">Incluir clientes sin visita</span>
          <Switch
            variant="sm"
            name="include-no-visit"
            checked={includeNoVisits}
            onChange={(event) => {
              const checked = event.target.checked;
              setIncludeNoVisits(checked);
              onChangeNoVisit(checked);
            }}
          />
        </div>
        <div className="flex flex-col gap-4 py-2">
          <h5>Visualizar clientes por:</h5>
          <div className="flex flex-col gap-2">
            {filterOptions.map((opt, index) => (
              <OptionRadio
                key={index}
                label={opt.label}
                value={opt.value}
                name="filterOption"
                checked={filterOptionValue === opt.value}
                onChange={(event) => {
                  const checked = event.target.checked;
                  if (checked) {
                    setFilterOptionValue(opt.value);
                    onChangeGroupCriteria(opt.value);
                  }
                }}
              />
            ))}
          </div>
        </div>
        <div className="pt-6 pb-2">
          <Button
            variant="tertiary"
            size="sm"
            className="w-full"
            onClick={handleReset}
          >
            Limpiar
          </Button>
        </div>
      </div>
      <MapLegend title="Visualización" items={legendOptions} />
    </div>
  );
};

export default SidebarFilter;
