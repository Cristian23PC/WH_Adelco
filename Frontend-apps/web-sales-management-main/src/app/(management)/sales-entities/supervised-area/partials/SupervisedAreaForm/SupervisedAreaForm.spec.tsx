import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SupervisedAreaForm, {
  SupervisedAreaFormProps
} from './SupervisedAreaForm';
import { SupervisedArea } from '@/types/SupervisedAreas';
import useGetBranches from '@/hooks/branches/useGetBranches';
import useUsers from '@/hooks/users';

jest.mock('@/hooks/branches/useGetBranches', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue({ branches: [] })
}));
jest.mock('@/hooks/users', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue({ usersOptions: [] })
}));

const mockSupervisedArea: SupervisedArea = {
  id: 1,
  name: 'foo-name',
  supervisorId: 'foo-supervisor',
  branchId: '1',
  territoriesCounter: 4,
  supervisorName: 'supervisor name',
  territory: 'territory name'
};

const Component = (props: Partial<SupervisedAreaFormProps>) => (
  <SupervisedAreaForm
    supervisedArea={mockSupervisedArea}
    onSubmit={jest.fn()}
    onRemove={jest.fn()}
    onClose={jest.fn()}
    shouldValidateOnClose={false}
    {...props}
  />
);

describe('SupervisedAreaForm component', () => {
  describe('render', () => {
    it('should display all supervisedArea values', async () => {
      await act(async () => {
        render(<Component />);
      });

      const nameField = screen.getByDisplayValue(mockSupervisedArea.name);
      const supervisorIdField = screen.getByDisplayValue(
        mockSupervisedArea.supervisorName
      );
      const branchIdField = screen.getByDisplayValue(
        mockSupervisedArea.territory
      );

      expect(nameField).toBeInTheDocument();
      expect(supervisorIdField).toBeInTheDocument();
      expect(branchIdField).toBeInTheDocument();
    });
  });

  describe('actions', () => {
    it('should call onSubmit when change values', async () => {
      const supervisedAreaModified: SupervisedArea = {
        id: 1,
        name: 'bar-name',
        supervisorId: 'bar-supervisor',
        supervisorName: 'supervisor name 2',
        branchId: '2',
        territory: 'territory name 2',
        territoriesCounter: 4
      };
      (useGetBranches as jest.Mock).mockReturnValue({
        branches: [
          {
            name: supervisedAreaModified.territory,
            id: supervisedAreaModified.branchId
          }
        ],
        search: jest.fn()
      });
      (useUsers as jest.Mock).mockReturnValue({
        users: [
          {
            firstName: 'supervisor name',
            lastName: '2',
            username: supervisedAreaModified.supervisorId
          }
        ]
      });
      const onSubmitSpy = jest.fn();
      render(<Component onSubmit={onSubmitSpy} />);

      const nameField = screen.getByDisplayValue(mockSupervisedArea.name);
      const supervisorIdField = screen.getByDisplayValue(
        mockSupervisedArea.supervisorName
      );
      const territoryField = screen.getByDisplayValue(
        mockSupervisedArea.territory
      );

      await act(async () => {
        userEvent.clear(nameField);
        userEvent.type(nameField, supervisedAreaModified.name);
        userEvent.click(supervisorIdField);
        userEvent.click(
          screen.getByText(supervisedAreaModified.supervisorName)
        );
        userEvent.click(territoryField);
        userEvent.click(screen.getByText(supervisedAreaModified.territory));
      });

      await act(async () => {
        userEvent.click(screen.getByText('Guardar cambios'));
      });

      expect(onSubmitSpy).toHaveBeenCalledWith({
        name: supervisedAreaModified.name,
        branchId: supervisedAreaModified.branchId,
        supervisorId: supervisedAreaModified.supervisorId
      });
    });
  });
});
