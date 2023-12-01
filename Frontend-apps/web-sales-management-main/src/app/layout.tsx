'use client';
import React, { FC, PropsWithChildren } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useScreen } from '@/hooks/useScreen';
import { Logo, Footer, Toaster } from '@adelco/web-components';
import Navbar from '@/components/Navbar';

import './globals.css';
import '@adelco/web-components/dist/tailwind.css';
import useAuthentication from '@/hooks/auth/useAuthentication';

const queryClient = new QueryClient();

const RootLayout: FC<PropsWithChildren> = ({ children }) => {
  const { isLoading } = useAuthentication();
  const { isDesktop } = useScreen();

  return (
    <html lang="en">
      <body className="flex h-screen flex-col justify-between min-h-[950px]">
        {isDesktop && !isLoading && (
          <>
            <Toaster />
            <Navbar />
            {children}
            <Footer
              address="Av. Apoquindo 4820, piso 10"
              email="contacto@adelco.cl"
              phone="800 0000 0000"
              year="2023"
              instagramLink="#"
              facebookLink="#"
              linkedinLink="#"
            />
          </>
        )}
        {!isDesktop && (
          <div className="flex h-screen flex-col items-center justify-center p-12">
            <Logo width={180} className="mb-8" />
            <p className="text-center">
              La Web de gestión solo está disponible en la versión de
              escritorio.
            </p>
          </div>
        )}
      </body>
    </html>
  );
};

const WrappedRootLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <RootLayout>{children}</RootLayout>
    </QueryClientProvider>
  );
};

export default WrappedRootLayout;
