import { FC, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Sort } from '@adelco/web-components';
import useTrackSort from 'helpers/hooks/analytics/useTrackSort';
import useUser from 'frontastic/actions/adelco/user/useUser';

interface ProductSortingProps {
  open: boolean;
  onClose: VoidFunction;
}
const ProductSorting: FC<ProductSortingProps> = ({ open, onClose }) => {
  const [selectedSort, setSelectedSort] = useState('');
  const [sortList, setSortList] = useState([]);
  const router = useRouter();
  const { user } = useUser();
  const { trackSelectSortCriteria } = useTrackSort();

  const handleChangeRouter = (data: string) => {
    const { slug, locale, ...cleanQuery } = router.query;

    trackSelectSortCriteria(data);
    router.push({
      pathname: router.asPath.split('?')[0],
      query: {
        ...cleanQuery,
        sort: data
      }
    });

    onClose();
  };

  const handleSelectedSortChange = (value: string) => {
    setSelectedSort(value);
  };

  useEffect(() => {
    const sortListPrice = [
      {
        value: 'variants.attributes.price.centAmount desc',
        label: 'Mayor precio'
      },
      {
        value: 'variants.attributes.price.centAmount asc',
        label: 'Menor precio'
      }
    ];

    const sortListName = [
      { value: 'name.es-CL asc', label: 'A - Z' },
      { value: 'name.es-CL desc', label: 'Z - A' }
    ];
    setSortList([...(user?.dch ? sortListPrice : []), ...sortListName]);
    setSelectedSort(router.query.sort as string);
  }, [user?.dch, router.query.sort]);

  return (
    <Sort
      key={sortList.length}
      title="Ordenar productos"
      open={open}
      sortList={sortList}
      selectedValue={selectedSort}
      onClose={onClose}
      onApply={handleChangeRouter}
      onSelect={handleSelectedSortChange}
    />
  );
};

export default ProductSorting;
