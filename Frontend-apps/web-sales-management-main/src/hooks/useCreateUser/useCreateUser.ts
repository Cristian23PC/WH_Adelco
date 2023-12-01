import { createUser } from '@/api/Users/Users';
import { toast } from '@adelco/web-components';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { KEY } from '@/hooks/useUser/userUsers';

const useCreateUser = () => {
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(createUser, {
    onError: (errorMessage: string) =>
      toast.error({ text: errorMessage, position: 'top-right' }),
    onSuccess: () => {
      queryClient.invalidateQueries([KEY]);
      toast.success({
        text: 'Usuario creado con éxito',
        position: 'top-right'
      });
    }
  });

  return { createUser: mutate, isLoading };
};

export default useCreateUser;
