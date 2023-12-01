import { render, screen, fireEvent } from '@testing-library/react';
import BranchesTable from './BranchesTable';

const mockBranches = [
  {
    id: 1,
    name: 'Branch 1',
    code: 'Code1',
    zone: {
      id: 1,
      name: 'Zone 1'
    },
    supervisedAreasCounter: 5
  },
  {
    id: 2,
    name: 'Branch 2',
    code: 'Code2',
    zone: {
      id: 2,
      name: 'Zone 2'
    },
    supervisedAreasCounter: 3
  }
];

describe('BranchesTable', () => {
  describe('renderer', () => {
    it('should render table with branches', () => {
      const { getByText } = render(
        <BranchesTable
          branches={mockBranches}
          page={1}
          setPage={() => {}}
          totalPages={1}
          onClickView={() => {}}
        />
      );

      for (const branch of mockBranches) {
        const branchName = getByText(branch.name);
        const zoneName = getByText(branch.zone.name);
        const supervisedAreasCounter = getByText(
          String(branch.supervisedAreasCounter)
        );

        expect(branchName).toBeInTheDocument();
        expect(zoneName).toBeInTheDocument();
        expect(supervisedAreasCounter).toBeInTheDocument();
      }
    });

    it('should render pagination when totalPages is greater than 1', () => {
      render(
        <BranchesTable
          branches={[]}
          page={1}
          setPage={() => {}}
          totalPages={2}
          onClickView={() => {}}
        />
      );

      const pageOneButton = screen.getByText('1');
      const pageTwoButton = screen.getByText('2');
      expect(pageOneButton).toBeInTheDocument();
      expect(pageTwoButton).toBeInTheDocument();
    });
  });

  describe('actions', () => {
    it('calls setPage when paginator buttons are clicked', () => {
      const setPageSpy = jest.fn();
      const { getByText } = render(
        <BranchesTable
          branches={mockBranches}
          page={1}
          setPage={setPageSpy}
          totalPages={2}
          onClickView={() => {}}
        />
      );

      const nextPageButton = getByText('2');
      fireEvent.click(nextPageButton);

      expect(setPageSpy).toHaveBeenCalledWith(2);

      const prevPageButton = getByText('1');
      fireEvent.click(prevPageButton);

      expect(setPageSpy).toHaveBeenCalledWith(1);
    });

    it('calls onClickView when "Ver más" button is clicked', () => {
      const onClickViewSpy = jest.fn();
      const { getByText } = render(
        <BranchesTable
          branches={[mockBranches[0]]}
          page={1}
          setPage={() => {}}
          totalPages={1}
          onClickView={onClickViewSpy}
        />
      );

      const viewMoreButton = getByText('Ver más');
      fireEvent.click(viewMoreButton);

      expect(onClickViewSpy).toHaveBeenCalledWith(mockBranches[0]);
    });
  });
});
