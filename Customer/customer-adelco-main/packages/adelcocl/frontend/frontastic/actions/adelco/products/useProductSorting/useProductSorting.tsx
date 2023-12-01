import { useState } from 'react';
import { useRouter } from 'next/router';
import { Sort } from '@adelco/web-components';

const useProductSorting = () => {
  const [isSortMenuOpen, setSortMenuOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState('');
  const router = useRouter();

  const openSortMenu = () => setSortMenuOpen(true);
  const closeSortMenu = () => setSortMenuOpen(false);

  const handleChangeRouter = (data: string) => {
    const { slug, locale, ...cleanQuery } = router.query;

    router.push({
      pathname: router.asPath.split('?')[0],
      query: {
        ...cleanQuery,
        sort: data
      }
    });

    closeSortMenu();
  };

  const handleSelectedSortChange = (value: string) => {
    setSelectedSort(value);
  };

  const SortComponent = (
    <Sort
      title="Ordenar productos"
      open={isSortMenuOpen}
      sortList={[
        {
          value: 'variants.attributes.price.centAmount desc',
          label: 'Mayor precio'
        },
        {
          value: 'variants.attributes.price.centAmount asc',
          label: 'Menor precio'
        },
        { value: 'name.es-CL asc', label: 'A - Z' },
        { value: 'name.es-CL desc', label: 'Z - A' }
      ]}
      selectedValue={selectedSort}
      onClose={closeSortMenu}
      onApply={handleChangeRouter}
      onSelect={handleSelectedSortChange}
    />
  );

  return {
    SortComponent: () => SortComponent,
    openSortMenu
  };
};

export default useProductSorting;
