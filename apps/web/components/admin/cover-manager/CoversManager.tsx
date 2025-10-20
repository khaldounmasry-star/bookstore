'use client';

import { useState } from 'react';
import {
  Box,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Typography,
  Button,
  Stack
} from '@mui/material';
import { CoversList, AddCover } from '.';
import { CoversManagerProps } from '../../../types';

export const CoversManager = ({ books }: CoversManagerProps) => {
  const [selectedBookId, setSelectedBookId] = useState<number | ''>('');
  const [showAddForm, setShowAddForm] = useState<boolean>(false);

  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={3} marginBottom={8}>
        <FormControl sx={{ flex: 1, minWidth: 300 }}>
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

        <Button
          variant="contained"
          color="primary"
          sx={{ whiteSpace: 'nowrap', flexShrink: 0, height: 56 }}
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm && selectedBookId ? 'Hide cover' : 'Show cover'}
        </Button>
      </Stack>

      {selectedBookId && showAddForm && <AddCover selectedBookId={selectedBookId} />}

      {selectedBookId ? (
        <CoversList books={books} selectedBookId={Number(selectedBookId)} />
      ) : (
        <Typography color="text.secondary">Select a book to manage its covers.</Typography>
      )}
    </Box>
  );
};
