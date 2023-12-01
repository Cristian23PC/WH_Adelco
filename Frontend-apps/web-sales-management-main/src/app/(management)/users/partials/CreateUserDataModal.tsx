import RolesForm, { rolesFormSchema } from '@/components/forms/RolesForm';
import UserInfoForm, {
  userInfoFormSchema
} from '@/components/forms/UserInfoForm';
import ZoneManagerForm from '@/components/forms/ZoneManagerForm';
import useCreateUser from '@/hooks/useCreateUser';
import { UserPayload } from '@/types/User';
import { yupResolver } from '@hookform/resolvers/yup';
import { getSupervisedUser } from '@/utils/roles';
import { Button, Modal } from '@adelco/web-components';
import { FC, useState } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { mergeSchemas } from '@/utils/schemas';
import ConfirmDiscardChanges from '../../utils/ConfirmDiscardChanges';

interface CreateUserDataModalProps {
  open: boolean;
  onClose: VoidFunction;
}

const CreateUserDataModal: FC<CreateUserDataModalProps> = ({
  onClose,
  open
}) => {
  const [isOpenDiscardModal, setIsOpenDiscardModal] = useState(false);
  const { createUser, isLoading } = useCreateUser();
  const formController = useForm<UserPayload>({
    resolver: yupResolver(mergeSchemas(rolesFormSchema, userInfoFormSchema))
  });
  const {
    handleSubmit,
    watch,
    formState: { isDirty }
  } = formController;

  const handleClose = () => {
    if (isDirty) setIsOpenDiscardModal(true);
    else onClose();
  };

  if (isOpenDiscardModal) {
    return (
      <Modal id="create-user-discard-modal" onClose={onClose} open>
        <ConfirmDiscardChanges
          onSubmit={async () => {
            await createUser(watch());
            onClose();
          }}
          onCancel={onClose}
          isLoading={isLoading}
        />
      </Modal>
    );
  }

  return (
    <Modal id="create-user-modal" onClose={handleClose} open={open}>
      <form
        onSubmit={handleSubmit(async (userPayload) => {
          await createUser(userPayload);
          onClose();
        })}
        className="flex flex-col gap-[26px] w-[300px] text-corporative-03"
      >
        <UserInfoForm
          formController={formController as UseFormReturn<any>}
          title="Crear usuario"
        />
        <RolesForm formController={formController as UseFormReturn<any>} />
        {getSupervisedUser(watch('role')) && (
          <ZoneManagerForm
            formController={formController as UseFormReturn<any>}
          />
        )}
        <Button
          variant="secondary"
          size="sm"
          type="submit"
          loading={isLoading}
          disabled={!formController.formState.isValid}
        >
          Crear usuario
        </Button>
      </form>
    </Modal>
  );
};

export default CreateUserDataModal;
