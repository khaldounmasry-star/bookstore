'use client';

import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TablePagination,
  IconButton,
  Tooltip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { FC } from 'react';
import { Column, BooksTableProps, Book } from '../../../types';
import { useBooksTable } from '../../../hooks/useBooksTable';
import { ConfirmationModal } from '../confirmation-modal';
import { ActionNotification } from '../action-notification';
import { useBookDeletion } from '../../../hooks/useBookDeletion';

const columns: Column[] = [
  { id: 'title', label: 'Title' },
  { id: 'author', label: 'Author' },
  { id: 'genre', label: 'Genre' },
  { id: 'year', label: 'Year', numeric: true },
  { id: 'price', label: 'Price', numeric: true },
  { id: 'sku', label: 'SKU' }
];

const renderCellValue = (colId: keyof Book, book: Book): React.ReactNode => {
  const value = book[colId];

  if (colId === 'sku') {
    const sku = typeof value === 'string' ? value : '';
    return (
      <Tooltip title={sku}>
        <span>{sku.length > 10 ? `${sku.slice(0, 10)}...` : sku}</span>
      </Tooltip>
    );
  }

  if (Array.isArray(value)) {
    return value.length > 0 ? `${value.length} cover(s)` : 'No covers';
  }

  if (typeof value === 'number' || typeof value === 'string') {
    return value;
  }

  return '-';
};

export const BooksTable: FC<BooksTableProps> = ({ books }) => {
  const {
    order,
    orderBy,
    page,
    rowsPerPage,
    visibleRows,
    onRequestSort,
    onPageChange,
    onRowsPerPageChange
  } = useBooksTable(books);

  const {
    loading,
    success,
    alert,
    confirmOpen,
    selectedBook,
    openConfirmDialog,
    closeConfirmDialog,
    handleConfirmDelete,
    resetNotificationsCallbacks
  } = useBookDeletion();

  return (
    <Box sx={{ mt: 3 }}>
      <Paper>
        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="books table">
            <TableHead sx={{ bgcolor: 'grey.100' }}>
              <TableRow>
                {columns.map(({ id, label }) => (
                  <TableCell
                    key={id}
                    sortDirection={orderBy === id ? order : false}
                    sx={{ fontWeight: 600 }}
                  >
                    <TableSortLabel
                      active={orderBy === id}
                      direction={orderBy === id ? order : 'asc'}
                      onClick={e => onRequestSort(e, id)}
                    >
                      {label}
                    </TableSortLabel>
                  </TableCell>
                ))}
                <TableCell align="center" sx={{ fontWeight: 600 }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {visibleRows?.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + 1}
                    align="center"
                    sx={{ py: 4, color: 'text.secondary' }}
                  >
                    No books found
                  </TableCell>
                </TableRow>
              ) : (
                visibleRows?.map(book => (
                  <TableRow
                    key={book.id}
                    hover
                    sx={{
                      transition: 'background-color 0.2s ease',
                      '&:hover': { bgcolor: 'grey.50' }
                    }}
                  >
                    {columns.map(col => (
                      <TableCell key={col.id}>{renderCellValue(col.id, book)}</TableCell>
                    ))}
                    <TableCell align="center">
                      <Tooltip title={`Edit ${book.title}`}>
                        <IconButton color="info" size="medium">
                          <EditIcon fontSize="medium" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip
                        title={`Delete ${book.title}`}
                        onClick={() => openConfirmDialog(book)}
                      >
                        <IconButton color="error" size="medium">
                          <DeleteIcon fontSize="medium" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={books.length}
          page={page}
          onPageChange={onPageChange}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={onRowsPerPageChange}
          rowsPerPageOptions={[5, 10, 25]}
          sx={{ px: 2 }}
        />
      </Paper>
      <ConfirmationModal
        open={confirmOpen}
        title="Confirm Deletion"
        message={
          <>
            Are you sure you want to delete user: <b>{selectedBook?.title}</b>?
          </>
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
        loading={loading}
        onConfirm={handleConfirmDelete}
        onClose={closeConfirmDialog}
      />
      {(success || alert) && (
        <ActionNotification
          success={success}
          callbacks={resetNotificationsCallbacks()}
          successMessage={`Book ${selectedBook?.title} deleted successfully!`}
          alert={alert}
        />
      )}
    </Box>
  );
};
