import { UnableCreateAccountScreen } from '@adelco/web-components';
import { linkRenderer } from 'frontastic/tastics/adelco/products/CategoryCarousel';
import { formatWhatsAppMessage } from '../../../../helpers/utils/whatsappMessage';
import { STEPS } from '../useStep';

const UnableCreateAccount = ({ onChangeStep, values }) => {
  const userValues = {
    firstName: values.firstName,
    surname: values.surname,
    rut: values.rut,
    email: values.username
  };

  return (
    <UnableCreateAccountScreen
      onTryAgain={() => onChangeStep(STEPS.HOME)}
      callCenter="600 600 6363"
      linkRenderer={linkRenderer}
      whatsAppLink={formatWhatsAppMessage(userValues)}
    />
  );
};

export default UnableCreateAccount;
