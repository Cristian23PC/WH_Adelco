import Modal from '../modal';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';

const Loader = ({
  isOpen,
  title = 'Cargando...',
}: {
  isOpen: boolean;
  title?: string;
}) => {
  return (
    <Modal isOpen={isOpen}>
      <LoadingSpinner scale="l" maxDelayDuration={0}>
        {title}
      </LoadingSpinner>
    </Modal>
  );
};

export default Loader;
