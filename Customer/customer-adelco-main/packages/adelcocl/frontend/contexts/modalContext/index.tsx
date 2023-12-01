import { createContext, useContext, useState, useCallback } from 'react';
import ZoneSelector from 'frontastic/tastics/adelco/zoneSelector';
import LoginModal from 'frontastic/tastics/adelco/LoginModal/LoginModal';
import useTrackLogin from 'helpers/hooks/analytics/useTrackLogin';

export const ModalContext = createContext({
  openLoginModal: () => {},
  closeLoginModal: () => {},
  openZoneModal: () => {},
  closeZoneModal: () => {},
  isLoginModalOpen: false,
  isZoneModalOpen: false
});

export const useModalContext = () => useContext(ModalContext);

export const ModalProvider = ({ children }) => {
  const [isZoneModalOpen, setIsZoneModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { trackOpenLogin } = useTrackLogin();

  const openZoneModal = useCallback(() => {
    setIsZoneModalOpen(true);
  }, []);

  const closeZoneModal = useCallback(() => {
    setIsZoneModalOpen(false);
  }, []);

  const openLoginModal = useCallback(() => {
    trackOpenLogin();
    setIsLoginModalOpen(true);
  }, []);

  const closeLoginModal = useCallback(() => {
    setIsLoginModalOpen(false);
  }, []);

  return (
    <ModalContext.Provider
      value={{
        isLoginModalOpen,
        openLoginModal,
        closeLoginModal,
        isZoneModalOpen,
        openZoneModal,
        closeZoneModal
      }}
    >
      {children}
      <LoginModal open={isLoginModalOpen} onClose={closeLoginModal} />
      <ZoneSelector open={isZoneModalOpen} onClose={closeZoneModal} />
    </ModalContext.Provider>
  );
};
