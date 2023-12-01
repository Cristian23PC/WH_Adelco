import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Modal from './Modal';

const onCloseMock = jest.fn();

describe('Modal component', () => {
  const dataTestId = 'adelco-modal';
  const title = 'Modal Title';
  const bodyContent = 'Modal content';

  it('should render the component', async () => {
    render(
      <Modal onClose={onCloseMock} title={title} open={true} showLogo={true}>
        <span>{bodyContent}</span>
      </Modal>
    );
    const component = await screen.findByTestId(dataTestId);
    expect(component).toBeInTheDocument();
  });
  it('should display the component when prop open is false', () => {
    render(
      <Modal onClose={onCloseMock} title={title} showLogo={true}>
        <span>{bodyContent}</span>
      </Modal>
    );
    const component = screen.queryByTestId(dataTestId);
    expect(component).not.toBeInTheDocument();
  });
  it('should call onClose fn', async () => {
    render(
      <Modal onClose={onCloseMock} title={title} open={true} showLogo={true}>
        <span>{bodyContent}</span>
      </Modal>
    );
    const closeIcon = await screen.findByTestId('icon-close');
    expect(closeIcon).toBeInTheDocument();
    fireEvent.click(closeIcon);
    expect(onCloseMock).toHaveBeenCalled();
  });
  it('should not display logo', () => {
    render(
      <Modal onClose={onCloseMock} title={title} open={true}>
        <span>{bodyContent}</span>
      </Modal>
    );
    expect(screen.queryByTestId('corporative-logo')).not.toBeInTheDocument();
  });
});
