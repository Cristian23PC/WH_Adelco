import { removeUser } from '@/api/Users/Users';
import { toast } from '@adelco/web-components';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { KEY } from './useUsersList';

const useRemoveUser = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, isLoading } = useMutation(removeUser, {
    onSuccess: () => {
      queryClient.invalidateQueries([KEY]);
      toast.success({
        text: 'Usuario eliminado con éxito',
        iconName: 'done',
        position: 'top-right'
      });
    }
  });

  return { removeUser: mutateAsync, isLoading };
};

export default useRemoveUser;
