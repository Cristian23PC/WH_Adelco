import React, { type FC } from 'react';
import LoginModal, {
  type LoginModalProps,
  DEFAULT_LITERALS as l
} from './LoginModal';
import { linkRendererMock } from '../../uikit/navigation/CategoriesMenu/CategoriesMenuMocks';
import { act, fireEvent, render, screen } from '@testing-library/react';

const Component: FC<Partial<LoginModalProps>> = (props) => {
  return (
    <LoginModal
      onClose={jest.fn()}
      onSubmit={jest.fn()}
      open
      {...props}
      linkRenderer={linkRendererMock}
      resetPasswordLink="/resetPassword"
      registerLink="/register"
    />
  );
};

describe('LoginModal', () => {
  describe('actions', () => {
    const onSubmitSpy = jest.fn();
    const values = {
      username: 'foo@foo',
      password: 'password'
    };
    it('should call onSubmit with defaultValues', async () => {
      render(<Component onSubmit={onSubmitSpy} defaultValues={values} />);

      await act(async () => {
        fireEvent.click(screen.getByText(l.submit));
      });

      expect(onSubmitSpy).toHaveBeenCalledWith(values);
    });
  });
});
