'use client';
import { useState } from 'react';
import useSupervisedAreas from '@/hooks/supervisedAreas/useSupervisedAreas';
import { Modal, Spinner } from '@adelco/web-components';
import SupervisedAreasTable from './partials/SupervisedAreasTable/SupervisedAreasTable';
import Header from '@/components/Header';
import { SupervisedArea, SupervisedAreaDraft } from '@/types/SupervisedAreas';
import SupervisedAreaForm from './partials/SupervisedAreaForm';
import useUpdateSupervisedArea from '@/hooks/supervisedAreas/useUpdateSupervisedArea';
import useCreateSupervisedArea from '@/hooks/supervisedAreas/useCreateSupervisedArea';
import useRemoveSupervisedArea from '@/hooks/supervisedAreas/useRemoveSupervisedArea';
import RemoveEntityModal from '@/components/Modals/RemoveEntityModal/RemoveEntityModal';
import { SupervisedAreaFormValues } from './partials/SupervisedAreaForm/supervisedAreaSchema';
import ConfirmDiscardChanges from '../../utils/ConfirmDiscardChanges';

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
  supervisedArea?: SupervisedArea;
};

const modalInfoInitialState = {
  isOpen: false,
  modal: null
};

const SupervisedArea = () => {
  const [modalInfo, setModalInfo] = useState<ModalInfo>(modalInfoInitialState);
  const [editValues, setEditValues] = useState<SupervisedAreaFormValues | null>(
    null
  );
  const [shouldValidateOnClose, setShouldValidateOnClose] = useState(false);
  const { supervisedAreas, page, setPage, totalPages, isLoading } =
    useSupervisedAreas();
  const { mutateAsync: updateSupervisedArea, isLoading: isUpdateLoading } =
    useUpdateSupervisedArea({
      onSuccess: () => handleConfirmClose(),
      onError: () => handleConfirmClose()
    });
  const { mutateAsync: createSupervisedArea, isLoading: isCreateLoading } =
    useCreateSupervisedArea({
      onSuccess: () => handleConfirmClose(),
      onError: () => handleConfirmClose()
    });
  const { mutateAsync: removeSupervisedArea, isLoading: isRemoveLoading } =
    useRemoveSupervisedArea({
      onSuccess: () => handleConfirmClose(),
      onError: () => handleConfirmClose()
    });

  const handleOpenFormModal = (supervisedArea?: SupervisedArea) => {
    setModalInfo({ isOpen: true, modal: MODALS.FORM, supervisedArea });
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
    data: SupervisedAreaFormValues
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
    const modalToOpen = modalInfo.supervisedArea?.territoriesCounter
      ? MODALS.UNABLE_REMOVE
      : MODALS.CONFIRM_REMOVE;

    setModalInfo((prevState) => ({
      ...prevState,
      modal: modalToOpen
    }));
  };

  const handleRemove = async () => {
    if (modalInfo.supervisedArea?.id)
      await removeSupervisedArea(modalInfo.supervisedArea.id);
  };

  const handleOnSubmit = async (values: SupervisedAreaDraft) => {
    if (modalInfo.supervisedArea) {
      await updateSupervisedArea({
        ...values,
        id: modalInfo.supervisedArea.id
      });
    } else {
      await createSupervisedArea(values);
    }
  };

  return (
    <main className="flex flex-col gap-6">
      <Header
        headerLabel="Áreas supervisadas"
        ctaLabel="Crear área supervisada"
        ctaOnClick={() => handleOpenFormModal()}
      />
      {isLoading ? (
        <Spinner />
      ) : (
        <SupervisedAreasTable
          supervisedAreas={supervisedAreas?.results || []}
          page={page}
          setPage={setPage}
          totalPages={totalPages}
          onClickView={handleOpenFormModal}
        />
      )}
      <Modal
        id="supervised-areas-modal"
        open={modalInfo.isOpen}
        onClose={handleCloseModal}
      >
        {modalInfo.modal === MODALS.FORM && (
          <SupervisedAreaForm
            supervisedArea={modalInfo.supervisedArea}
            onClose={handleCloseFormModal}
            shouldValidateOnClose={shouldValidateOnClose}
            onSubmit={handleOnSubmit}
            onRemove={handleOnClickRemove}
          />
        )}

        {modalInfo.modal === MODALS.CONFIRM_DISCARD_CHANGES && (
          <ConfirmDiscardChanges
            text="Para ver los cambios reflejados en el área supervisada es necesario guardarlos."
            isLoading={isUpdateLoading || isCreateLoading}
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
                modalInfo.supervisedArea?.territoriesCounter === 1
                  ? 'Esta área supervisada tiene 1 territorio asignado.'
                  : `Esta área supervisada tiene ${modalInfo.supervisedArea?.territoriesCounter} territorios asignados.`,
              text:
                modalInfo.supervisedArea?.territoriesCounter === 1
                  ? 'Para eliminarla primero se debe desasignar el territorio.'
                  : `Para eliminarla primero se deben desasignar los territorios.`,
              submitButton: 'Aceptar'
            }}
          />
        )}

        {modalInfo.modal === MODALS.CONFIRM_REMOVE && (
          <RemoveEntityModal
            onSubmit={handleRemove}
            isLoading={isRemoveLoading}
            onCancel={handleCloseModal}
          />
        )}
      </Modal>
    </main>
  );
};

export default SupervisedArea;
