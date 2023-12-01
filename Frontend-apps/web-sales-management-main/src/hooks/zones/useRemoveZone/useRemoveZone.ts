import { removeZone } from '@/api/Zones';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { KEY } from '../useGetZones';
import { toast } from '@adelco/web-components';
import { Zone } from '@/types/Zones';

const ERROR_MESSAGES: Record<number, string> = {
  400: 'La zona está asociada a una sucursal',
  401: 'La sesión ha expirado',
  403: 'No tienes permisos',
  404: 'No se ha encontrado la zona'
};

type RemoveZoneProps = {
  onSuccess?: (data: Zone) => void;
  onError?: (error: any) => void;
};

const useRemoveZone = ({ onSuccess, onError }: RemoveZoneProps = {}) => {
  const queryClient = useQueryClient();
  const { mutateAsync, isLoading } = useMutation(removeZone, {
    onSuccess: (data) => {
      queryClient.invalidateQueries([KEY]);
      toast.success({
        text: 'Zona eliminada con éxito',
        iconName: 'done',
        position: 'top-right'
      });

      onSuccess?.(data);
    },
    onError: (error: any) => {
      const statusCode = error?.statusCode;

      toast.error({
        title: `Error al eliminar la zona`,
        iconName: 'error',
        position: 'top-right',
        text: (statusCode && ERROR_MESSAGES[statusCode]) || ''
      });

      onError?.(error);
    }
  });

  return { removeZone: mutateAsync, isLoading };
};

export default useRemoveZone;
