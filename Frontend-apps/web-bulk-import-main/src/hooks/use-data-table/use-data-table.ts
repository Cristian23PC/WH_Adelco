/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
export const useDataTable = (page: number, perPage: number) => {
  const [allRows, setAllRows] = useState([]);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    setRows(allRows.slice((page - 1) * perPage, perPage * page));
  }, [page, perPage, allRows]);
  const [columns, setColumns] = useState([]);

  return { rows, allRows, setAllRows, setColumns, columns };
};
