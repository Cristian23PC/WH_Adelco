import { removeTerritory } from '@/api/Territory';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { KEY } from '../useTerritory';
import { toast } from '@adelco/web-components';

const useRemoveTerritory = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, isLoading } = useMutation(removeTerritory, {
    onSuccess: () => {
      queryClient.invalidateQueries([KEY]);
      toast.success({
        text: 'Territorio eliminado con éxito',
        iconName: 'done',
        position: 'top-right'
      });
    }
  });

  return { removeTerritory: mutateAsync, isLoading };
};

export default useRemoveTerritory;
