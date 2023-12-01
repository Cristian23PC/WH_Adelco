import { EmailMismatchScreen } from '@adelco/web-components';
import { linkRenderer } from 'frontastic/tastics/adelco/products/CategoryCarousel';
import { formatWhatsAppMessage } from '../../../../helpers/utils/whatsappMessage';

const EmailMismatchstep = ({ values }) => {
  const userValues = {
    firstName: values.firstName,
    surname: values.surname,
    rut: values.rut,
    email: values.username
  };

  return (
    <EmailMismatchScreen
      callCenter="600 600 6363"
      whatsAppLink={formatWhatsAppMessage(userValues)}
      linkRenderer={linkRenderer}
    />
  );
};

export default EmailMismatchstep;
