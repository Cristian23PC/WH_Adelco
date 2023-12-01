import { act, render, screen } from '@testing-library/react';
import UserDataItem, { UserDataItemProps } from './UserDataItem';

const Component = (props: Partial<UserDataItemProps>) => (
  <UserDataItem icon="menu" text="foo-text" {...props} />
);

describe('SellInfoItem component', () => {
  describe('render', () => {
    it('should render label correctly', async () => {
      const text = 'bar-text';

      await act(async () => {
        render(<Component text={text} />);
      });

      expect(screen.getByText(text)).toBeInTheDocument();
    });
  });
});
