/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useMemo, MouseEvent, ChangeEvent } from 'react';
import { Book } from '../types';

type Order = 'asc' | 'desc';

const descendingComparator = <T>(a: T, b: T, orderBy: keyof T): number => {
  const valA = a[orderBy];
  const valB = b[orderBy];
  if (valB < valA) return -1;
  if (valB > valA) return 1;
  return 0;
};

const getComparator = <Key extends keyof any>(
  order: Order,
  orderBy: Key
): ((a: Record<Key, any>, b: Record<Key, any>) => number) =>
  order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);

const stableSort = <T>(array: readonly T[], comparator: (a: T, b: T) => number): T[] =>
  array
    .map((el, index) => [el, index] as [T, number])
    .sort((a, b) => {
      const order = comparator(a[0], b[0]);
      return order !== 0 ? order : a[1] - b[1];
    })
    .map(el => el[0]);

export const useBooksTable = (books: Book[]) => {
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof Book>('title');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const onRequestSort = (_: MouseEvent<unknown>, property: keyof Book) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const onPageChange = (_: unknown, newPage: number) => setPage(newPage);

  const onRowsPerPageChange = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const visibleRows = useMemo(
    () =>
      stableSort(books, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [books, order, orderBy, page, rowsPerPage]
  );

  return {
    order,
    orderBy,
    page,
    rowsPerPage,
    visibleRows,
    onRequestSort,
    onPageChange,
    onRowsPerPageChange
  };
};
