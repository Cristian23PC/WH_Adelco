import { render, screen, act } from '@testing-library/react';
import ZonesTable from './ZonesTable';
import userEvent from '@testing-library/user-event';

const date = new Date();

const mockZones = [
  {
    name: 'Zone 1',
    zoneManager: {
      username: 'manager_one',
      createdAt: date,
      updatedAt: date,
      firstName: 'manager',
      lastName: 'one',
      role: '',
      status: ''
    },
    createdAt: date,
    deletedAt: date,
    updatedAt: date,
    id: 1,
    branchesCounter: 6
  },
  {
    name: 'Zone 2',
    zoneManager: {
      username: 'manager_two',
      createdAt: date,
      updatedAt: date,
      firstName: 'manager',
      lastName: 'two',
      role: '',
      status: ''
    },
    createdAt: date,
    deletedAt: date,
    updatedAt: date,
    id: 2,
    branchesCounter: 4
  }
];

describe('ZonesTable', () => {
  describe('renderer', () => {
    it('should render table with zones and call onViewMore', () => {
      const onViewMoreMock = jest.fn();
      render(
        <ZonesTable
          zones={mockZones}
          page={1}
          setPage={jest.fn()}
          totalPages={1}
          onViewItem={onViewMoreMock}
        />
      );

      for (let i = 0; i < mockZones.length; i++) {
        const zone = mockZones[i];
        const zoneName = screen.getByText(zone.name);
        const zoneManager = screen.getByText(
          [zone.zoneManager?.firstName, zone.zoneManager?.lastName].join(' ')
        );
        const zoneBranches = screen.getByText(zone.branchesCounter);
        const viewMoreButton = screen.getAllByRole('button', {
          name: 'Ver más'
        });

        expect(zoneName).toBeInTheDocument();
        expect(zoneManager).toBeInTheDocument();
        expect(zoneBranches).toBeInTheDocument();
        expect(viewMoreButton[i]).toBeInTheDocument();

        userEvent.click(viewMoreButton[i]);

        expect(onViewMoreMock).toHaveBeenCalledTimes(i + 1);
        expect(onViewMoreMock).toHaveBeenCalledWith(zone);
      }
    });

    it('should renders pagination when totalPages is greater than 0', async () => {
      await act(async () => {
        render(
          <ZonesTable
            zones={[]}
            page={1}
            setPage={jest.fn()}
            totalPages={2}
            onViewItem={jest.fn()}
          />
        );
      });

      const pageOneButton = screen.getByText('1');
      const pageTwoButton = screen.getByText('2');
      expect(pageOneButton).toBeInTheDocument();
      expect(pageTwoButton).toBeInTheDocument();
    });
  });

  describe('actions', () => {
    it('calls setPage when paginator buttons are clicked', () => {
      const setPageSpy = jest.fn();
      render(
        <ZonesTable
          zones={mockZones}
          page={1}
          setPage={setPageSpy}
          totalPages={2}
          onViewItem={jest.fn()}
        />
      );

      const nextPageButton = screen.getByText('2');
      userEvent.click(nextPageButton);

      expect(setPageSpy).toHaveBeenCalledWith(2);

      const prevPageButton = screen.getByText('1');
      userEvent.click(prevPageButton);

      expect(setPageSpy).toHaveBeenCalledWith(1);
    });
  });
});
