import { createSupervisedArea } from '@/api/SupervisedArea';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { KEY } from '../useSupervisedAreas';
import { toast } from '@adelco/web-components';
import { SupervisedArea } from '@/types/SupervisedAreas';

const ERROR_MESSAGES: Record<number, string> = {
  400: 'Recurso no encontrado',
  401: 'La sesión ha expirado',
  403: 'No tienes permisos',
  404: 'Recurso no encontrado',
  500: 'Error inesperado'
};

type CreateSupervisedAreaProps = {
  onSuccess?: (data: SupervisedArea) => void;
  onError?: (error: any) => void;
};

const useCreateSupervisedArea = ({
  onSuccess,
  onError
}: CreateSupervisedAreaProps = {}) => {
  const queryClient = useQueryClient();

  return useMutation(createSupervisedArea, {
    onSuccess: (data) => {
      queryClient.invalidateQueries([KEY]);
      toast.success({
        text: 'Área supervisada creada con éxito.',
        position: 'top-right',
        iconName: 'done'
      });
      onSuccess?.(data);
    },
    onError: (error: any) => {
      const statusCode = error?.statusCode;

      toast.error({
        title: `Error al crear la área supervisada`,
        text: (statusCode && ERROR_MESSAGES[statusCode]) || '',
        position: 'top-right',
        iconName: 'error'
      });

      onError?.(error);
    }
  });
};

export default useCreateSupervisedArea;
