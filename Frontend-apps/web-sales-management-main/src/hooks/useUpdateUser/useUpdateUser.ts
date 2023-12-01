import { updateUser } from '@/api/Users/Users';
import { toast } from '@adelco/web-components';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { KEY } from '@/hooks/useUser/userUsers';

const useUpdateUser = () => {
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(updateUser, {
    onError: (errorMessage: string) =>
      toast.error({ text: errorMessage, position: 'top-right' }),
    onSuccess: () => {
      queryClient.invalidateQueries([KEY]);
      toast.success({
        text: 'Usuario editado con éxito',
        position: 'top-right'
      });
    }
  });

  return { updateUser: mutate, isLoading };
};

export default useUpdateUser;
