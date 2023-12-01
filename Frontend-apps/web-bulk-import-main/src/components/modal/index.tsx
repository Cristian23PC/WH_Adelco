import './modalStyles.css';
import { IModal } from './interfaces/modal';

function Modal({ children, isOpen }: IModal) {
  if (!isOpen) return null;

  return (
    <div className="custom-modal" data-testid="custom-modal">
      <div className="custom-modal-content">{children}</div>
    </div>
  );
}
export default Modal;
