import { Commune } from '@Types/adelco/businessUnits';
import useImmutableSWR from 'swr/immutable';
import { fetchApiHub } from 'frontastic/lib/fetch-api-hub';

const KEY = '/action/businessUnits/getCommunes';

const useCommunes = (regionKey?: string) => {
  const { data } = useImmutableSWR<Commune[]>(
    regionKey ? [KEY, { regionKey }] : undefined,
    ([url, payload]) =>
      fetchApiHub(url, { body: JSON.stringify(payload), method: 'POST' })
  );

  return {
    communes: data || []
  };
};

export default useCommunes;
