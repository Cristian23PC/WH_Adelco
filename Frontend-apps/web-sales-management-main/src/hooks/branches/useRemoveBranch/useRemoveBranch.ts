import { removeBranch } from '@/api/Branches';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { KEY } from '../useGetBranches';
import { toast } from '@adelco/web-components';
import { Branch } from '@/types/Branch';

const ERROR_MESSAGES: Record<number, string> = {
  400: 'La sucursal está asociada a un área supervisada',
  401: 'La sesión ha expirado',
  403: 'No tienes permisos',
  404: 'No se ha encontrado la sucursal'
};

type RemoveBranchProps = {
  onSuccess?: (data: Branch) => void;
  onError?: (error: any) => void;
};

const useRemoveBranch = ({ onSuccess, onError }: RemoveBranchProps = {}) => {
  const queryClient = useQueryClient();
  const { mutateAsync, isLoading } = useMutation(removeBranch, {
    onSuccess: (data) => {
      queryClient.invalidateQueries([KEY]);
      toast.success({
        text: 'Sucursal eliminada con éxito',
        iconName: 'done',
        position: 'top-right'
      });

      onSuccess?.(data);
    },
    onError: (error: any) => {
      const statusCode = error?.statusCode;

      toast.error({
        title: `Error al eliminar la sucursal`,
        iconName: 'error',
        position: 'top-right',
        text: (statusCode && ERROR_MESSAGES[statusCode]) || ''
      });

      onError?.(error);
    }
  });

  return { removeBranch: mutateAsync, isLoading };
};

export default useRemoveBranch;
