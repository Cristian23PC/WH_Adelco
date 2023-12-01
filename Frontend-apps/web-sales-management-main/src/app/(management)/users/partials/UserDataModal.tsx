import RolesForm, { rolesFormSchema } from '@/components/forms/RolesForm';
import UserInfoForm, {
  userInfoFormEditSchema
} from '@/components/forms/UserInfoForm';
import { User } from '@/types/User';
import { Button, Modal } from '@adelco/web-components';
import { useForm, UseFormReturn } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { mergeSchemas } from '@/utils/schemas';
import { FC, useState } from 'react';
import ZoneManagerForm from '@/components/forms/ZoneManagerForm';
import { getSupervisedUser } from '@/utils/roles';
import useUpdateUser from '@/hooks/useUpdateUser';
import ConfirmDiscardChanges from '../../utils/ConfirmDiscardChanges';
import RemoveUserModal from './RemoveUserModal';

interface UserDataModalProps {
  onClose: () => void;
  userData?: User;
}

const UserDataModal: FC<UserDataModalProps> = ({ onClose, userData }) => {
  const [isOpenDiscardModal, setIsOpenDiscardModal] = useState(false);
  const [showConfirmRemove, setShowConfirmRemove] = useState(false);
  const formController = useForm<User>({
    defaultValues: userData,
    resolver: yupResolver(mergeSchemas(rolesFormSchema, userInfoFormEditSchema))
  });

  const openConfirmRemove = () => setShowConfirmRemove(true);
  const closeConfirmRemove = () => setShowConfirmRemove(false);

  const {
    watch,
    formState: { isDirty, isValid }
  } = formController;
  const { updateUser, isLoading } = useUpdateUser();

  const handleClose = () => {
    if (isDirty) setIsOpenDiscardModal(true);
    else onClose();
  };

  if (isOpenDiscardModal) {
    return (
      <Modal id="edit-user-discard-modal" onClose={onClose} open>
        <ConfirmDiscardChanges
          onSubmit={async () => {
            await updateUser(watch());
            onClose();
          }}
          onCancel={onClose}
          isLoading={isLoading}
        />
      </Modal>
    );
  }

  if (showConfirmRemove) {
    return (
      <RemoveUserModal
        userData={userData}
        onClose={onClose}
        onCancel={closeConfirmRemove}
      />
    );
  }

  return (
    <Modal
      id="edit-user-modal"
      onClose={handleClose}
      open={userData !== undefined}
    >
      <div className="flex flex-col gap-[26px] w-[300px] text-corporative-03">
        <UserInfoForm
          values={userData}
          viewMode
          formController={formController as UseFormReturn<any>}
        />
        <RolesForm formController={formController as UseFormReturn<any>} />
        {getSupervisedUser(watch('role')) && (
          <ZoneManagerForm
            formController={formController as UseFormReturn<any>}
          />
        )}
        {isDirty && (
          <Button
            variant="secondary"
            size="sm"
            loading={isLoading}
            disabled={!isValid}
            onClick={async () => {
              await updateUser(watch());
              onClose();
            }}
          >
            Guardar
          </Button>
        )}
        <div>
          <span
            onClick={openConfirmRemove}
            className="cursor-pointer underline font-semibold text-sm"
          >
            Eliminar usuario
          </span>
        </div>
      </div>
    </Modal>
  );
};

export default UserDataModal;
