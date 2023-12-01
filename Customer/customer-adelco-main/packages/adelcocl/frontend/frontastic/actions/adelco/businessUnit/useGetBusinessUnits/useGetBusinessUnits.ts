import { CtBusinessUnit } from '@Types/adelco/businessUnits';
import useImmutableSWR from 'swr/immutable';
import { fetchApiHub } from 'frontastic/lib/fetch-api-hub';

interface BusinessUnitResponse {
  businessUnits: CtBusinessUnit[];
}

const KEY = '/action/businessUnits/getBusinessUnitData';

const useGetBusinessUnits = () => {
  const { data } = useImmutableSWR<BusinessUnitResponse>(
    [KEY],
    ([url, payload]) =>
      fetchApiHub(url, { body: JSON.stringify(payload), method: 'POST' })
  );

  return {
    businessUnits: data?.businessUnits || []
  };
};

export default useGetBusinessUnits;
