import { createZone } from '@/api/Zones';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { KEY } from '../useGetZones';
import { toast } from '@adelco/web-components';
import { Zone } from '@/types/Zones';

const ERROR_MESSAGES: Record<number, string> = {
  400: 'Faltan datos requeridos',
  401: 'La sesión ha expirado',
  403: 'No tienes permisos',
  404: 'No tienes acceso al gerente'
};

type CreateZoneProps = {
  onSuccess?: (data: Zone) => void;
  onError?: (error: any) => void;
};

const useCreateZone = ({ onSuccess, onError }: CreateZoneProps = {}) => {
  const queryClient = useQueryClient();
  const { mutateAsync, isLoading, error } = useMutation(createZone, {
    onSuccess: (data) => {
      queryClient.invalidateQueries([KEY]);
      toast.success({
        text: 'Zona creada con éxito',
        iconName: 'done',
        position: 'top-right'
      });

      onSuccess?.(data);
    },
    onError: (error: any) => {
      const statusCode = error?.statusCode;

      toast.error({
        title: `Error al crear la zona`,
        iconName: 'error',
        position: 'top-right',
        text: (statusCode && ERROR_MESSAGES[statusCode]) || ''
      });

      onError?.(error);
    }
  });

  return { createZone: mutateAsync, isLoading, error };
};

export default useCreateZone;
