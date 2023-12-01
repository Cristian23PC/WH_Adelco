import { useRouter } from 'next/router';
import { AlreadyRegisteredScreen } from '@adelco/web-components';

const RegisteredWithBuStep = () => {
  const router = useRouter();

  return (
    <AlreadyRegisteredScreen
      onLogin={() => {
        router.push('/?openLogin=true', '/');
      }}
    />
  );
};

export default RegisteredWithBuStep;
