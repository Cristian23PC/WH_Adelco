import { FC } from 'react';
import useRemoveUser from '@/hooks/users/useRemoveUser';
import { User } from '@/types/User';
import { Button, Modal } from '@adelco/web-components';

interface RemoveUserModalProps {
  userData: User | undefined;
  onClose: VoidFunction;
  onCancel: VoidFunction;
}
const RemoveUserModal: FC<RemoveUserModalProps> = ({
  userData,
  onClose,
  onCancel
}) => {
  const { removeUser, isLoading } = useRemoveUser();

  const handleRemoveUser = async () => {
    if (!userData) return;

    await removeUser(userData?.username);
    onClose();
  };

  return (
    <Modal
      id="remove-user-modal"
      onClose={onClose}
      open={userData !== undefined}
    >
      <div className="w-[300px]">
        <h3 className="mb-2 font-semibold">Eliminar usuario</h3>
        <p className="text-sm mb-4">
          Si se elimina este usuario, la acción no se podrá deshacer.
        </p>
        <div className="flex justify-between gap-2.5">
          <Button onClick={onCancel} size="sm" variant="tertiary" block>
            Mantener
          </Button>
          <Button
            onClick={handleRemoveUser}
            size="sm"
            variant="secondary"
            loading={isLoading}
            block
          >
            Eliminar
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default RemoveUserModal;
