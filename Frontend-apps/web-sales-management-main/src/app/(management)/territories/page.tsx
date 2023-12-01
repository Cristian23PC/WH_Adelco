'use client';
import { useState } from 'react';
import { AxiosError } from 'axios';
import useTerritory from '@/hooks/territory/useTerritory';
import useCreateTerritory from '@/hooks/territory/useCreateTerritory';
import useEditTerritory from '@/hooks/territory/useEditTerritory';
import useRemoveTerritory from '@/hooks/territory/useRemoveTerritory';
import { Territory } from '@/types/Territory';
import {
  Paginator,
  Button,
  Modal,
  toast,
  Toaster,
  Spinner
} from '@adelco/web-components';
import Header from '@/components/Header';
import Table from '@/components/Table';
import TerritoryForm from './partials/TerritoryForm';
import ConfirmRemoveTerritory from './partials/ConfirmRemoveTerritory';
import ConfirmDiscardChanges from '../utils/ConfirmDiscardChanges';

enum MODALS {
  territoryForm = 'territoryForm',
  confirmRemoveTerritory = 'confirmRemoveTerritory',
  confirmDiscardChanges = 'confirmDiscardChanges'
}

export interface TerritoryResponse {
  error?: string;
  territoryId?: number;
}

export interface TerritoryFormValues {
  name: string;
  supervisedArea: string;
  salesRep?: string;
  description?: string;
}

const TerritoriesPage = () => {
  const { isLoading, territories, page, setPage, totalPages, search } =
    useTerritory();
  const { createTerritory } = useCreateTerritory();
  const { editTerritory, isLoading: isEditTerritoryLoading } =
    useEditTerritory();
  const { removeTerritory, isLoading: isRemoveTerritoryLoading } =
    useRemoveTerritory();

  const [shouldValidateOnClose, setShouldValidateOnClose] = useState(false);
  const [modalOpen, setModalOpen] = useState<MODALS | false>(false);
  const [editValues, setEditValues] = useState<TerritoryFormValues | null>(
    null
  );
  const [territorySelected, setTerritorySelected] = useState<
    Territory | undefined
  >(undefined);

  const handleOpenModal = (territory: Territory) => {
    setTerritorySelected(territory);
    setModalOpen(MODALS.territoryForm);
  };

  const handleRemoveTerritory = async () => {
    await removeTerritory(territorySelected?.id as number);
    setModalOpen(false);
  };

  const handleCreateTerritory = () => {
    setTerritorySelected(undefined);
    setModalOpen(MODALS.territoryForm);
  };

  const mapTableRows = (results: Territory[] | undefined) => {
    return results?.map((territory: Territory, index) => [
      territory.id,
      territory.name,
      [territory.salesRep?.firstName, territory.salesRep?.lastName].join(' '),
      territory.businessUnitsCounter,
      <Button
        key={index}
        size="xs"
        variant="tertiary"
        onClick={() => handleOpenModal(territory)}
        className="self-end"
      >
        Ver más
      </Button>
    ]);
  };

  const handleOnClose = ({ error, territoryId }: TerritoryResponse): void => {
    if (error) {
      toast.error({ text: error, iconName: 'error', position: 'top-right' });
    }
    if (territoryId) {
      const actionText = territorySelected ? 'modificado' : 'creado';
      toast.success({
        text: `Territorio ${actionText} con éxito`,
        iconName: 'done',
        position: 'top-right'
      });
    }
    setModalOpen(false);
  };

  const handleSubmit = async (values: TerritoryFormValues): Promise<void> => {
    let response;
    let payload = {
      name: values.name,
      supervisedAreaId: parseInt(values.supervisedArea),
      salesRepId: values.salesRep !== '' ? values.salesRep : null,
      description: values.description
    };
    if (!territorySelected) {
      response = await createTerritory({
        externalId: '123',
        ...payload
      });
    } else {
      const { salesRepId, ...rest } = payload;
      const name = [
        territorySelected.salesRep?.firstName,
        territorySelected.salesRep?.lastName
      ].join(' ');
      response = await editTerritory({
        payload: salesRepId === name ? rest : payload,
        id: territorySelected.id
      });
    }

    if (response instanceof AxiosError) {
      handleOnClose({
        error: (response as AxiosError<{ message: string }>).response?.data
          ?.message
      });
    } else {
      handleOnClose({ territoryId: response.id });
    }
  };

  const handleCloseModal = () => {
    if (modalOpen === MODALS.territoryForm) {
      setShouldValidateOnClose(true);
    } else {
      setModalOpen(false);
      setShouldValidateOnClose(false);
    }
  };

  const handleConfirmClose = (
    isDirty: boolean,
    data: TerritoryFormValues
  ): void => {
    setShouldValidateOnClose(false);
    if (!isDirty) {
      setModalOpen(false);
    } else {
      setEditValues(data);
      setModalOpen(MODALS.confirmDiscardChanges);
    }
  };

  const handleConfirmDiscard = () => {
    setEditValues(null);
    setModalOpen(false);
  };

  return (
    <main>
      {isLoading && <Spinner />}

      <Header
        headerLabel="Lista de Territorios"
        placeholder="Buscar territorio por ID, nombre de territorio o vendedor..."
        ctaLabel="Crear territorio"
        ctaOnClick={handleCreateTerritory}
        onSearch={search}
      />

      {!isLoading &&
        territories?.results &&
        territories?.results.length > 0 && (
          <div className="mt-6 flex w-m-[999px] flex-col items-center rounded-2xl bg-white p-4">
            <Table
              gridSizes={[1, 4, 4, 2, 1]}
              headerLabels={[
                'ID',
                'Territorio',
                'Vendedor',
                'Número de Clientes',
                ''
              ]}
              tableRows={mapTableRows(territories?.results)}
            />
            <div className="mb-4 mt-14 flex justify-center">
              <Paginator
                totalPages={totalPages}
                currentPage={page}
                onClick={(page: number) => {
                  setPage(page);
                }}
              />
            </div>
          </div>
        )}

      {!isLoading &&
        territories?.results &&
        territories?.results.length == 0 && (
          <div className="mt-6 flex w-m-[999px] rounded-2xl bg-white p-4 justify-center">
            <p className="text-sm">No hay resultados para su búsqueda</p>
          </div>
        )}

      <Modal
        id="territories-modal"
        open={Boolean(modalOpen)}
        onClose={handleCloseModal}
      >
        {modalOpen === MODALS.territoryForm && (
          <TerritoryForm
            territory={territorySelected}
            onSubmit={handleSubmit}
            onRemove={() => setModalOpen(MODALS.confirmRemoveTerritory)}
            onClose={(isDirty, data) => handleConfirmClose(isDirty, data)}
            shouldValidateOnClose={shouldValidateOnClose}
          />
        )}
        {modalOpen === MODALS.confirmRemoveTerritory && (
          <ConfirmRemoveTerritory
            onCancel={() => setModalOpen(MODALS.territoryForm)}
            onSubmit={handleRemoveTerritory}
            isLoading={isRemoveTerritoryLoading}
          />
        )}
        {modalOpen === MODALS.confirmDiscardChanges && (
          <ConfirmDiscardChanges
            onCancel={handleConfirmDiscard}
            onSubmit={() => {
              if (editValues) {
                handleSubmit(editValues);
              }
            }}
            isLoading={isEditTerritoryLoading}
          />
        )}
      </Modal>
      <Toaster />
    </main>
  );
};

export default TerritoriesPage;
