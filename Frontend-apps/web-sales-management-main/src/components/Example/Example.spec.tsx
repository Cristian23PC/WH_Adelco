import { render, screen, act, fireEvent } from '@testing-library/react';
import Example, { ExampleProps } from './Example';

const Component = (props: Partial<ExampleProps>) => (
  <Example onSubmit={jest.fn} {...props} />
);

describe('Example component', () => {
  describe('render', () => {
    it('should display count when componenet renderer', async () => {
      await act(async () => {
        render(<Component />);
      });

      expect(screen.getByText(0)).toBeInTheDocument();
    });
  });

  describe('actions', () => {
    it('should increment count on press +', async () => {
      await act(async () => {
        render(<Component />);
      });

      fireEvent.click(screen.getByTestId('inc-button'));

      expect(screen.getByText('1')).toBeInTheDocument();
    });

    it('should decrement count on press -', async () => {
      await act(async () => {
        render(<Component />);
      });

      fireEvent.click(screen.getByTestId('dec-button'));

      expect(screen.getByText('-1')).toBeInTheDocument();
    });

    it('should call onSubmit with count when press on submit', async () => {
      const onSubmitSpy = jest.fn();
      await act(async () => {
        render(<Component onSubmit={onSubmitSpy} />);
      });

      fireEvent.click(screen.getByTestId('inc-button'));
      fireEvent.click(screen.getByText('Submit'));

      expect(onSubmitSpy).toHaveBeenCalledWith(1);
    });
  });
});
