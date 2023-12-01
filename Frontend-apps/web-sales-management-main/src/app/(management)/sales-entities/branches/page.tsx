'use client';
import { useState } from 'react';
import { Branch } from '@/types/Branch';
import { BranchFormValues } from './partials/BranchForm/branchFormSchema';
import { Modal, Spinner } from '@adelco/web-components';
import BranchesNoResults from './partials/BranchesNoResults';
import BranchesTable from './partials/BranchesTable/BranchesTable';
import BranchForm from './partials/BranchForm/BranchForm';
import ConfirmDiscardChanges from '../../utils/ConfirmDiscardChanges';
import Header from '@/components/Header';
import useCreateBranch from '@/hooks/branches/useCreateBranch';
import useEditBranch from '@/hooks/branches/useEditBranch';
import useGetBranches from '@/hooks/branches/useGetBranches';
import useRemoveBranch from '@/hooks/branches/useRemoveBranch';
import RemoveEntityModal from '@/components/Modals/RemoveEntityModal/RemoveEntityModal';

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
  branch?: Branch;
};

const modalInfoInitialState = {
  isOpen: false,
  modal: null
};

const BranchPage = () => {
  const [modalInfo, setModalInfo] = useState<ModalInfo>(modalInfoInitialState);
  const [editValues, setEditValues] = useState<any | null>(null);
  const [shouldValidateOnClose, setShouldValidateOnClose] = useState(false);
  const { branches, page, setPage, totalPages, isLoading } = useGetBranches();
  const { createBranch, isLoading: isCreateBranchLoading } = useCreateBranch({
    onSuccess: () => handleConfirmClose(),
    onError: () => handleConfirmClose()
  });
  const { editBranch, isLoading: isEditBranchLoading } = useEditBranch({
    onSuccess: () => handleConfirmClose(),
    onError: () => handleConfirmClose()
  });
  const { removeBranch, isLoading: isRemoveBranchLoading } = useRemoveBranch({
    onSuccess: () => handleConfirmClose(),
    onError: () => handleConfirmClose()
  });

  const handleOpenFormModal = (branch?: Branch) => {
    setModalInfo({ isOpen: true, modal: MODALS.FORM, branch });
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

  const handleCloseFormModal = (isDirty: boolean, data: any): void => {
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
    const modalToOpen = modalInfo.branch?.supervisedAreasCounter
      ? MODALS.UNABLE_REMOVE
      : MODALS.CONFIRM_REMOVE;

    setModalInfo((prevState) => ({
      ...prevState,
      modal: modalToOpen
    }));
  };

  const handleRemove = async (id: number) => {
    await removeBranch(id);
  };

  const handleOnSubmit = async (data: BranchFormValues) => {
    const payload = { ...data, zoneId: parseInt(data.zoneId) };

    if (!modalInfo.branch) {
      await createBranch(payload);
    } else {
      await editBranch({ payload, id: modalInfo.branch.id });
    }
  };

  return (
    <main className="flex flex-col gap-6">
      {isLoading && <Spinner />}

      <Header
        headerLabel="Sucursales"
        ctaLabel="Crear sucursal"
        ctaOnClick={() => handleOpenFormModal()}
      />

      {!isLoading &&
        branches &&
        (branches.length > 0 ? (
          <BranchesTable
            branches={branches || []}
            page={page}
            setPage={setPage}
            totalPages={totalPages}
            onClickView={handleOpenFormModal}
          />
        ) : (
          <BranchesNoResults />
        ))}

      <Modal
        id="branches-modal"
        open={modalInfo.isOpen}
        onClose={handleCloseModal}
      >
        {modalInfo.modal === MODALS.FORM && (
          <BranchForm
            branch={modalInfo.branch}
            onClose={handleCloseFormModal}
            shouldValidateOnClose={shouldValidateOnClose}
            onSubmit={handleOnSubmit}
            onRemove={handleOnClickRemove}
          />
        )}

        {modalInfo.modal === MODALS.CONFIRM_DISCARD_CHANGES && (
          <ConfirmDiscardChanges
            text="Para ver los cambios reflejados en la sucursal es necesario guardarlos."
            isLoading={isEditBranchLoading || isCreateBranchLoading}
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
                modalInfo.branch?.supervisedAreasCounter === 1
                  ? 'Esta sucursal tiene 1 área supervisada asignada.'
                  : `Esta sucursal tiene ${modalInfo.branch?.supervisedAreasCounter} áreas supervisadas asignadas.`,
              text:
                modalInfo.branch?.supervisedAreasCounter === 1
                  ? 'Para eliminarla primero se debe desasignar la área supervisada.'
                  : `Para eliminarla primero se deben desasignar las áreas supervisadas.`,
              submitButton: 'Aceptar'
            }}
          />
        )}

        {modalInfo.modal === MODALS.CONFIRM_REMOVE && (
          <RemoveEntityModal
            onSubmit={() =>
              modalInfo.branch?.id && handleRemove(modalInfo.branch.id)
            }
            isLoading={isRemoveBranchLoading}
            onCancel={handleCloseModal}
          />
        )}
      </Modal>
    </main>
  );
};

export default BranchPage;
