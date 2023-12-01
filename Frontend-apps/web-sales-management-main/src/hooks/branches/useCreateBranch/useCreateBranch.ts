import { createBranch } from '@/api/Branches';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { KEY } from '../useGetBranches';
import { toast } from '@adelco/web-components';
import { Branch } from '@/types/Branch';

const ERROR_MESSAGES: Record<number | string, string> = {
  'Sales-007': 'El código debe ser único',
  400: 'Faltan datos requeridos',
  401: 'La sesión ha expirado',
  403: 'No tienes permisos',
  404: 'No se ha encontrado la zona'
};

type CreateBranchProps = {
  onSuccess?: (data: Branch) => void;
  onError?: (error: any) => void;
};

const useCreateBranch = ({ onSuccess, onError }: CreateBranchProps = {}) => {
  const queryClient = useQueryClient();
  const { mutateAsync, isLoading, error } = useMutation(createBranch, {
    onSuccess: (data) => {
      queryClient.invalidateQueries([KEY]);
      toast.success({
        text: 'Sucursal creada con éxito',
        iconName: 'done',
        position: 'top-right'
      });

      onSuccess?.(data);
    },
    onError: (error: any) => {
      const statusCode = error?.statusCode;
      const errorCode = error?.code;

      const errorMessage =
        errorCode || statusCode
          ? ERROR_MESSAGES[errorCode] || ERROR_MESSAGES[statusCode] || ''
          : '';

      toast.error({
        title: `Error al crear la sucursal`,
        iconName: 'error',
        position: 'top-right',
        text: errorMessage
      });

      onError?.(error);
    }
  });

  return { createBranch: mutateAsync, isLoading, error };
};

export default useCreateBranch;
