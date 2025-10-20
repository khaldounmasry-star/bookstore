'use client';

import { useState } from 'react';
import { Box, FormControl, Select, MenuItem, InputLabel, Typography } from '@mui/material';
import { CoversList } from './CoversList';
import { CoversManagerProps } from '../../../types';

export const CoversManager = ({ books }: CoversManagerProps) => {
  const [selectedBookId, setSelectedBookId] = useState<number | ''>('');

  return (
    <Box>
      <FormControl fullWidth sx={{ mb: 4 }}>
        <InputLabel id="book-select-label">Select Book</InputLabel>
        <Select
          labelId="book-select-label"
          value={selectedBookId}
          label="Select Book"
          onChange={e => setSelectedBookId(Number(e.target.value))}
        >
          {books.map(book => (
            <MenuItem key={book.id} value={book.id}>
              {book.title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {selectedBookId ? (
        <CoversList books={books} selectedBookId={Number(selectedBookId)} />
      ) : (
        <Typography color="text.secondary">Select a book to manage its covers.</Typography>
      )}
    </Box>
  );
};
