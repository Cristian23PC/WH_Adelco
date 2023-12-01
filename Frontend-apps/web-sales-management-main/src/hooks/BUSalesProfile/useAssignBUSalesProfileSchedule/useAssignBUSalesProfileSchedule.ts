import { setVisitSchedule } from '@/api/BUSalesProfile';
import { toast } from '@adelco/web-components';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { KEY } from '../useBUSalesProfile';
import { Error } from '@/types/Error';

const useAssignBUSalesProfileSchedule = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, isLoading, error } = useMutation(setVisitSchedule, {
    onError: (errorMessage: Error) => {
      errorMessage.message.forEach((err: string) => {
        toast.error({
          text: err,
          position: 'top-right'
        });
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries([KEY]);
      toast.success({
        text: 'Agenda guardada con éxito',
        position: 'top-right'
      });
    }
  });
  return { assignSchedule: mutateAsync, isLoading, error };
};

export default useAssignBUSalesProfileSchedule;
