import { createTerritory } from '@/api/Territory';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { KEY } from '../useTerritory';

const useCreateTerritory = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, isLoading, error } = useMutation(createTerritory, {
    onSuccess: () => {
      queryClient.invalidateQueries([KEY]);
    }
  });

  return { createTerritory: mutateAsync, isLoading, error };
};

export default useCreateTerritory;
