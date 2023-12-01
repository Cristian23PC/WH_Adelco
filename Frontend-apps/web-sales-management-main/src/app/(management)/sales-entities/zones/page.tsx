'use client';
import { useState } from 'react';
import { Modal, Spinner } from '@adelco/web-components';
import { Zone } from '@/types/Zones';
import { ZoneFormValues } from './partials/ZoneForm/zoneFormSchema';
import ZoneForm from './partials/ZoneForm';
import ZonesNoResults from './partials/ZonesNoResults';
import ZonesTable from './partials/ZonesTable/ZonesTable';
import Header from '@/components/Header';
import ConfirmDiscardChanges from '../../utils/ConfirmDiscardChanges';
import RemoveEntityModal from '@/components/Modals/RemoveEntityModal';
import useGetZones from '@/hooks/zones/useGetZones';
import useCreateZone from '@/hooks/zones/useCreateZone';
import useEditZone from '@/hooks/zones/useEditZone';
import useRemoveZone from '@/hooks/zones/useRemoveZone';

enum MODALS {
  FORM = 'FORM',
  CONFIRM_REMOVE = 'CONFIRM_REMOVE',
  UNABLE_REMOVE = 'UNABLE_REMOVE',
  CONFIRM_DISCARD_CHANGES = 'CONFIRM_DISCARD_CHANGES'
}

const MODAL_CLOSE_TIMEOUT = 200;

type ModalInfo = {
  isOpen: boolean;
  modal: MODALS | null;
  zone?: Zone;
};

const modalInfoInitialState = {
  isOpen: false,
  modal: null
};

const Zones = () => {
  const [modalInfo, setModalInfo] = useState<ModalInfo>(modalInfoInitialState);
  const [editValues, setEditValues] = useState<ZoneFormValues | null>(null);
  const [shouldValidateOnClose, setShouldValidateOnClose] = useState(false);
  const { isLoading, zones, page, setPage, totalPages } = useGetZones();
  const { createZone, isLoading: isCreateZoneLoading } = useCreateZone({
    onSuccess: () => handleConfirmClose(),
    onError: () => handleConfirmClose()
  });
  const { editZone, isLoading: isEditZoneLoading } = useEditZone({
    onSuccess: () => handleConfirmClose(),
    onError: () => handleConfirmClose()
  });
  const { removeZone, isLoading: isRemoveZoneLoading } = useRemoveZone({
    onSuccess: () => handleConfirmClose(),
    onError: () => handleConfirmClose()
  });

  const handleOpenFormModal = (zone?: Zone) => {
    setModalInfo({ isOpen: true, modal: MODALS.FORM, zone });
  };

  const handleConfirmClose = () => {
    setModalInfo((prevState) => ({ ...prevState, isOpen: false }));

    setTimeout(() => {
      setModalInfo({ isOpen: false, modal: null });
      setShouldValidateOnClose(false);
      setEditValues(null);
    }, MODAL_CLOSE_TIMEOUT);
  };

  const handleCloseModal = () => {
    if (modalInfo.modal === MODALS.FORM) {
      setShouldValidateOnClose(true);
    } else {
      handleConfirmClose();
    }
  };

  const handleCloseFormModal = (
    isDirty: boolean,
    data: ZoneFormValues
  ): void => {
    if (isDirty) {
      setEditValues(data);
      setModalInfo((prevState) => ({
        ...prevState,
        modal: MODALS.CONFIRM_DISCARD_CHANGES
      }));
    } else {
      handleConfirmClose();
    }
  };

  const handleOnClickRemove = () => {
    const modalToOpen = modalInfo.zone?.branchesCounter
      ? MODALS.UNABLE_REMOVE
      : MODALS.CONFIRM_REMOVE;

    setModalInfo((prevState) => ({
      ...prevState,
      modal: modalToOpen
    }));
  };

  const handleRemove = async (id: number) => {
    await removeZone(id);
  };

  const handleOnSubmit = async (data: ZoneFormValues) => {
    if (!modalInfo.zone) {
      await createZone(data);
    } else {
      await editZone({ payload: data, id: modalInfo.zone.id });
    }
  };

  return (
    <main>
      {isLoading && <Spinner />}

      <Header
        headerLabel="Zonas"
        ctaLabel="Crear Zona"
        ctaOnClick={() => handleOpenFormModal()}
      />

      {!isLoading &&
        zones?.results &&
        (zones?.results.length > 0 ? (
          <ZonesTable
            zones={zones?.results || []}
            page={page}
            setPage={setPage}
            totalPages={totalPages}
            onViewItem={handleOpenFormModal}
          />
        ) : (
          <ZonesNoResults />
        ))}

      <Modal
        id="zones-modal"
        open={modalInfo.isOpen}
        onClose={handleCloseModal}
      >
        {modalInfo.modal === MODALS.FORM && (
          <ZoneForm
            zone={modalInfo.zone}
            onClose={handleCloseFormModal}
            shouldValidateOnClose={shouldValidateOnClose}
            onSubmit={handleOnSubmit}
            onRemove={handleOnClickRemove}
          />
        )}

        {modalInfo.modal === MODALS.CONFIRM_DISCARD_CHANGES && (
          <ConfirmDiscardChanges
            text="Para ver los cambios reflejados en la zona es necesario guardarlos."
            isLoading={isEditZoneLoading || isCreateZoneLoading}
            onCancel={handleConfirmClose}
            onSubmit={() => {
              if (editValues) {
                handleOnSubmit(editValues);
              }
            }}
          />
        )}

        {modalInfo.modal === MODALS.UNABLE_REMOVE && (
          <RemoveEntityModal
            onSubmit={handleCloseModal}
            isLoading={false}
            literals={{
              subtitle:
                modalInfo.zone?.branchesCounter === 1
                  ? 'Esta zona tiene 1 sucursal asignada.'
                  : `Esta zona tiene ${modalInfo.zone?.branchesCounter} sucursales asignadas.`,
              text:
                modalInfo.zone?.branchesCounter === 1
                  ? 'Para eliminarla primero se debe desasignar la sucursal.'
                  : `Para eliminarla primero se deben desasignar las sucursales.`,
              submitButton: 'Aceptar'
            }}
          />
        )}

        {modalInfo.modal === MODALS.CONFIRM_REMOVE && (
          <RemoveEntityModal
            onSubmit={() =>
              modalInfo.zone?.id && handleRemove(modalInfo.zone.id)
            }
            isLoading={isRemoveZoneLoading}
            onCancel={handleCloseModal}
          />
        )}
      </Modal>
    </main>
  );
};

export default Zones;
