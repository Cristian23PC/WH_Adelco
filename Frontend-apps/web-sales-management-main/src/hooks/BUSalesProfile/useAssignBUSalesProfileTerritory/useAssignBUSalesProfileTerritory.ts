import { assignBUSalesProfileTerritory } from '@/api/BUSalesProfile';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { KEY } from '../useBUSalesProfile';

const useAssignBUSalesProfileTerritory = () => {
  const queryclient = useQueryClient();
  const { mutateAsync, isLoading, error } = useMutation(
    assignBUSalesProfileTerritory,
    {
      onSuccess: () => {
        queryclient.invalidateQueries([KEY]);
      }
    }
  );
  return { assignTerritory: mutateAsync, isLoading, error };
};

export default useAssignBUSalesProfileTerritory;
