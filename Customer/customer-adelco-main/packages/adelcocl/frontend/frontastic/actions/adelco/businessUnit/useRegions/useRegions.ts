import { Region } from '@Types/adelco/businessUnits';
import useImmutableSWR from 'swr/immutable';

const KEY = '/action/businessUnits/getRegions';

const useRegions = () => {
  const { data } = useImmutableSWR<Region[]>(KEY);

  return {
    regions: data || []
  };
};

export default useRegions;
