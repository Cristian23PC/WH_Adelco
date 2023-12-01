import { useState } from 'react';
import { getZones } from '@/api/Zones';
import { ZonesPageResult, ZonesPageResultResponse } from '@/types/Zones';
import { useQuery } from '@tanstack/react-query';
import { toQueryParams } from '@/utils/Request';
import { toast } from '@adelco/web-components';
import { Error } from '@/types/Error';

export const KEY = 'zones';

const ERRORS_MESSAGES: Record<number, string> = {
  401: 'La sesión ha expirado',
  403: 'No tienes permisos',
  404: 'No se han encontrado zonas'
};

type GetZonesProps = {
  onSuccess?: (data: ZonesPageResultResponse) => void;
  onError?: (error: any) => void;
  limit?: number;
};

const useGetZones = ({
  onSuccess,
  onError,
  limit: zonesLimit = 10
}: GetZonesProps = {}) => {
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(zonesLimit);
  const [text, setText] = useState<string>('');

  const { data, isLoading, error } = useQuery<
    ZonesPageResultResponse,
    Error,
    ZonesPageResult
  >(
    [KEY, page, limit, text],
    () => getZones(toQueryParams({ offset: (page - 1) * limit, limit, text })),
    {
      staleTime: 1000 * 60 * 5,
      onSuccess: (data) => {
        onSuccess?.(data);
      },
      onError: (error: any) => {
        const statusCode = error?.statusCode;

        toast.error({
          title: 'Error al obtener las zonas',
          iconName: 'error',
          position: 'top-right',
          text: (statusCode && ERRORS_MESSAGES[statusCode]) || ''
        });

        onError?.(error);
      }
    }
  );

  const totalPages = data?.total ? Math.ceil(data?.total / limit) : 0;

  return {
    zones: data,
    isLoading,
    error,
    page,
    setPage,
    query: text,
    search: setText,
    totalPages
  };
};

export default useGetZones;
