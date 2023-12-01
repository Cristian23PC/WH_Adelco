import { FC, useState } from 'react';
import { Button, Modal, UserEmailForm } from '@adelco/web-components';
import useValidation from 'frontastic/actions/adelco/user/useValidation';
import { OnChangeStep, STEPS } from '../useStep';
import { useRouter } from 'next/router';
interface HomeStepProps {
  onChangeStep: OnChangeStep;
}

const HomeStep: FC<HomeStepProps> = ({ onChangeStep }) => {
  const { trigger } = useValidation();
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleBeContacted = () => {
    // TODO implement contact
    handleCloseModal();
  };

  const handleSubmit = async (formData) => {
    try {
      const res = await trigger({
        rut: formData.rut,
        username: formData.username
      });

      if (res.status === 200 && !res?.body?.code) {
        onChangeStep(STEPS['REGISTER_PASSWORD'], {
          ...formData,
          razonSocial: res.body.buName
        });
      } else {
        if (res.body.code === 'BU-007') {
          setModalOpen(true);
        } else {
          onChangeStep(STEPS[res.body.code], formData);
        }
      }
    } catch (e) {}
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <>
      <Modal
        id="unable-create-account-modal"
        open={modalOpen}
        onClose={handleCloseModal}
      >
        <div className="flex flex-col gap-8">
          <p>En estos momentos no es posible crear tu cuenta</p>
          <p className="font-bold">
            ¿Deseas ser contactado para continuar el proceso?
          </p>
          <div className="flex justify-center gap-2.5">
            <Button variant="tertiary" onClick={handleCloseModal} block>
              No
            </Button>
            <Button variant="secondary" onClick={handleBeContacted} block>
              Sí
            </Button>
          </div>
        </div>
      </Modal>
      <UserEmailForm onSubmit={handleSubmit} onBack={handleBack} />
    </>
  );
};

export default HomeStep;
