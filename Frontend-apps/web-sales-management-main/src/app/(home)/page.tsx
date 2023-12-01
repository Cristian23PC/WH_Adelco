'use client';
import { Button } from '@adelco/web-components';
import { login } from '@/api/Keycloak';

const WelcomePage = () => {
  return (
    <main className="flex flex-col h-[948px]  justify-center">
      <div className="flex flex-col items-center  gap-y-4 ">
        <div className="font-title text-[56px] font-bold text-center">
          Bienvenido
        </div>
        <div className="text-lg text-center">a la web de gestión</div>
        {/* <Link href={'/clients'}> */}
        <Button size="sm" onClick={login}>
          Ingresar
        </Button>
        {/* </Link> */}
      </div>
    </main>
  );
};

export default WelcomePage;
