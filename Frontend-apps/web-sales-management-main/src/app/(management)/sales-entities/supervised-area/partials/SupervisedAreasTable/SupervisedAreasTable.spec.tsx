import {
  render,
  screen,
  act,
  fireEvent,
  getByTestId
} from '@testing-library/react';
import SupervisedAreasTable from './SupervisedAreasTable';

const mockSupervisedAreas = [
  {
    id: 1,
    name: 'Área 1',
    supervisorName: 'Supervisor 1',
    territory: 'Territorio 1',
    territoriesCounter: 1
  },
  {
    id: 2,
    name: 'Área 2',
    supervisorName: 'Supervisor 2',
    territory: 'Territorio 2',
    territoriesCounter: 2
  }
];

describe('SupervisedAreasTable', () => {
  describe('renderer', () => {
    it('should render table with supervised areas', () => {
      const { getByText } = render(
        <SupervisedAreasTable
          supervisedAreas={mockSupervisedAreas}
          page={1}
          setPage={() => {}}
          totalPages={1}
          onClickView={() => {}}
        />
      );

      for (const supervisedArea of mockSupervisedAreas) {
        const areaName = getByText(supervisedArea.name);
        const supervisorName = getByText(supervisedArea.supervisorName);
        const territory = getByText(supervisedArea.territory);

        expect(areaName).toBeInTheDocument();
        expect(supervisorName).toBeInTheDocument();
        expect(territory).toBeInTheDocument();
      }
    });

    it('should renders pagination when totalPages is greater than 1', async () => {
      await act(async () => {
        render(
          <SupervisedAreasTable
            supervisedAreas={[]}
            page={1}
            setPage={() => {}}
            totalPages={2}
            onClickView={() => {}}
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
      const { getByTestId } = render(
        <SupervisedAreasTable
          supervisedAreas={mockSupervisedAreas}
          page={1}
          setPage={setPageSpy}
          totalPages={2}
          onClickView={() => {}}
        />
      );

      const nextPageButton = getByTestId('page-2');

      fireEvent.click(nextPageButton);

      expect(setPageSpy).toHaveBeenCalledWith(2);

      const prevPageButton = getByTestId('page-1');
      fireEvent.click(prevPageButton);

      expect(setPageSpy).toHaveBeenCalledWith(1);
    });
  });
});
