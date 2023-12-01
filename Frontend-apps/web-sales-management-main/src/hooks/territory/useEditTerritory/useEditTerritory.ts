import { editTerritory } from '@/api/Territory';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { KEY } from '../useTerritory';

const useEditTerritory = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, isLoading, error } = useMutation(editTerritory, {
    onSuccess: () => {
      queryClient.invalidateQueries([KEY]);
    }
  });

  return { editTerritory: mutateAsync, isLoading, error };
};

export default useEditTerritory;
