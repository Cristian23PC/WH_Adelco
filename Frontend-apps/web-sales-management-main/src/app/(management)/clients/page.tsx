'use client';
import { useState } from 'react';
import classNames from 'classnames';
import useBUsalesProfile from '@/hooks/BUSalesProfile/useBUSalesProfile';
import { BUSalesProfile } from '@/types/BUSalesProfile';
import {
  Paginator,
  Button,
  Modal,
  toast,
  Spinner,
  Switch,
  Tooltip
} from '@adelco/web-components';
import BUForm from './partials/BUForm';
import VisitPlanner from './partials/visitPlanner/VisitPlanner';
import Header from '@/components/Header';
import Table from '@/components/Table';
import { BUInfoType } from './mockData';
import useAssignBUSalesProfileTerritory from '@/hooks/BUSalesProfile/useAssignBUSalesProfileTerritory';
import { AxiosError } from 'axios';
import ConfirmDiscardChanges from '../utils/ConfirmDiscardChanges';

export interface BUProfileTerritoryValues {
  id?: number;
  territory?: string;
}

export interface BUProfileResponse {
  error?: string;
  buId?: number;
}

enum MODALS {
  buSalesProfileForm = 'buForm',
  confirmDiscardChanges = 'confirmDiscardChanges',
  visitPlanner = 'visitPlanner'
}

const ClientsPage = () => {
  const {
    buSalesProfiles,
    isLoading,
    page,
    setPage,
    search,
    totalPages,
    unassignedOnly,
    toggleUnassignedOnly
  } = useBUsalesProfile();
  const { assignTerritory, isLoading: isAssignTerritoryLoading } =
    useAssignBUSalesProfileTerritory();

  const [shouldValidateOnClose, setShouldValidateOnClose] = useState(false);
  const [modalOpen, setModalOpen] = useState<MODALS | false>(false);
  const [buSelected, setBuSelected] = useState<BUInfoType | undefined>();
  const [editValues, setEditValues] = useState<
    BUProfileTerritoryValues | undefined
  >(undefined);

  const handleOpenModal = (buSalesProfile: BUSalesProfile, modal: MODALS) => {
    setBuSelected(buSalesProfile);
    setModalOpen(modal);
  };

  const mapTableRows = (results: BUSalesProfile[] | undefined) => {
    return results?.map((buSalesProfile: BUSalesProfile, index) => [
      buSalesProfile.id,
      buSalesProfile.name,
      buSalesProfile.salesRepName,
      buSalesProfile.territoryName,
      <div key={index} className="flex gap-2 justify-end">
        {!buSalesProfile.salesRepName && (
          <Tooltip
            text="No puedes asignar visita sin antes tener un vendedor asociado."
            className="w-[101px] whitespace-normal"
          >
            <Button
              iconName="timer"
              variant="tertiary"
              size="xs"
              disabled={!buSalesProfile.salesRepName}
              className={classNames(
                buSalesProfile.schedule ? 'text-success' : 'text-silver',
                {
                  'text-warning':
                    buSalesProfile?.schedule?.schedulingRule.frequencyCode === 2
                }
              )}
              onClick={() =>
                handleOpenModal(buSalesProfile, MODALS.visitPlanner)
              }
            />
          </Tooltip>
        )}
        {buSalesProfile.salesRepName && (
          <Button
            iconName="timer"
            variant="tertiary"
            size="xs"
            className={classNames(
              buSalesProfile.schedule ? 'text-success' : 'text-silver',
              {
                'text-warning':
                  buSalesProfile?.schedule?.schedulingRule.frequencyCode === 2
              }
            )}
            onClick={() => handleOpenModal(buSalesProfile, MODALS.visitPlanner)}
          />
        )}
        <Button
          key={index}
          size="xs"
          variant="tertiary"
          onClick={() =>
            handleOpenModal(buSalesProfile, MODALS.buSalesProfileForm)
          }
        >
          Ver más
        </Button>
      </div>
    ]);
  };

  const handleOnClose = ({ error, buId }: BUProfileResponse): void => {
    if (error) {
      toast.error({ text: error, iconName: 'error', position: 'top-right' });
    }
    if (buId) {
      toast.success({
        text: 'Cliente actualizado con éxito',
        iconName: 'done',
        position: 'top-right'
      });
    }
    setModalOpen(false);
  };

  const handleSubmit = async (data: BUProfileTerritoryValues) => {
    if (!data.id) return null;
    const response = await assignTerritory({
      id: data.id,
      territoryId: data.territory ? parseInt(data?.territory) : undefined
    });

    if (response instanceof AxiosError) {
      handleOnClose({
        error: (response as AxiosError<{ message: string }>).response?.data
          ?.message
      });
    } else {
      handleOnClose({ buId: response.id });
    }
  };

  const handleCloseModal = () => {
    if (modalOpen === MODALS.buSalesProfileForm) {
      setShouldValidateOnClose(true);
    } else {
      setModalOpen(false);
      setShouldValidateOnClose(false);
    }
  };

  const handleConfirmClose = (
    isDirty: boolean,
    data: BUProfileTerritoryValues
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
    setBuSelected(undefined);
    setModalOpen(false);
  };

  return (
    <main>
      {isLoading && <Spinner />}

      <Header
        headerLabel="Lista de Clientes"
        placeholder="Buscar cliente por ID, nombre de negocio, vendedor o nombre de territorio..."
        onSearch={(term) => {
          search(term);
        }}
        endElement={
          <div className="flex items-center gap-2 text-xs text-corporative-03">
            <label htmlFor="unassignedOnly">Clientes sin territorio</label>
            <Switch
              id="unassignedOnly"
              checked={unassignedOnly}
              onChange={toggleUnassignedOnly}
            />
          </div>
        }
      />

      {!isLoading &&
        buSalesProfiles?.results &&
        buSalesProfiles?.results.length > 0 && (
          <div className="mt-6 flex w-m-[999px] flex-col items-center rounded-2xl bg-white p-4">
            <Table
              gridSizes={[1, 3, 4, 2, 2]}
              headerLabels={[
                'ID',
                'Nombre de negocio',
                'Vendedor',
                'Territorio',
                ''
              ]}
              tableRows={mapTableRows(buSalesProfiles?.results)}
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
        buSalesProfiles?.results &&
        buSalesProfiles?.results.length == 0 && (
          <div className="mt-6 flex w-m-[999px] rounded-2xl bg-white p-4 justify-center">
            <p className="text-sm">No hay resultados para su búsqueda</p>
          </div>
        )}

      <Modal
        id="clients-modal"
        open={Boolean(modalOpen)}
        onClose={handleCloseModal}
      >
        {modalOpen === MODALS.buSalesProfileForm && (
          <BUForm
            buInfo={buSelected}
            onSubmit={handleSubmit}
            onClose={(isDirty, data) => handleConfirmClose(isDirty, data)}
            shouldValidateOnClose={shouldValidateOnClose}
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
            isLoading={isAssignTerritoryLoading}
          />
        )}
        {modalOpen === MODALS.visitPlanner && buSelected && (
          <VisitPlanner
            buid={buSelected.id}
            schedule={buSelected.schedule}
            onClose={handleConfirmDiscard}
          />
        )}
      </Modal>
    </main>
  );
};

export default ClientsPage;
