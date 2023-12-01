import { removeSupervisedArea } from '@/api/SupervisedArea';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { KEY } from '../useSupervisedAreas';
import { toast } from '@adelco/web-components';
import { SupervisedArea } from '@/types/SupervisedAreas';

const ERROR_MESSAGES: Record<number, string> = {
  400: 'La área está asociada a un territorio',
  401: 'La sesión ha expirado',
  403: 'No tienes permisos',
  404: 'Recurso no encontrado',
  500: 'Error inesperado'
};

type RemoveSupervisedAreaProps = {
  onSuccess?: (data: SupervisedArea) => void;
  onError?: (error: any) => void;
};

const useRemoveSupervisedArea = ({
  onSuccess,
  onError
}: RemoveSupervisedAreaProps = {}) => {
  const queryClient = useQueryClient();

  return useMutation(removeSupervisedArea, {
    onSuccess: (data) => {
      queryClient.invalidateQueries([KEY]);
      toast.success({
        text: 'Área supervisada borrada con éxito',
        iconName: 'done',
        position: 'top-right'
      });

      onSuccess?.(data);
    },
    onError: (error: any) => {
      const statusCode = error?.statusCode;

      toast.error({
        title: `Error al eliminar la área supervisada`,
        iconName: 'error',
        position: 'top-right',
        text: (statusCode && ERROR_MESSAGES[statusCode]) || ''
      });

      onError?.(error);
    }
  });
};

export default useRemoveSupervisedArea;
