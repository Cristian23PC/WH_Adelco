import { render } from '@testing-library/react';
import Modal from '.';

describe('Modal', () => {
  it('should render correctly when isOpen is true', () => {
    const { getByTestId } = render(
      <Modal isOpen={true}>
        <p>Modal Content</p>
      </Modal>
    );

    const modal = getByTestId('custom-modal');
    expect(modal).toBeInTheDocument();
  });

  it('should not render when isOpen is false', () => {
    const { queryByTestId } = render(
      <Modal isOpen={false}>
        <p>Modal Content</p>
      </Modal>
    );

    const modal = queryByTestId('custom-modal');
    expect(modal).toBeNull();
  });
});
