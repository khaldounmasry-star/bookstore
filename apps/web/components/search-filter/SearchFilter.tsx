'use client';

import {
  Drawer,
  Box,
  IconButton,
  TextField,
  MenuItem,
  Tooltip,
  Button,
  Typography,
} from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const genres = [
  { label: 'All', value: '' },
  { label: 'Fiction', value: 'Fiction' },
  { label: 'Non-fiction', value: 'Non-fiction' },
  { label: 'Fantasy', value: 'Fantasy' },
  { label: 'Science', value: 'Science' },
  { label: 'Biography', value: 'Biography' },
];

const sortOptions = [
  { label: 'Title', value: 'title' },
  { label: 'Price', value: 'price' },
  { label: 'Rating', value: 'rating' },
];

const orderOptions = [
  { label: 'Ascending', value: 'asc' },
  { label: 'Descending', value: 'desc' },
];

export const SearchFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);

  const [genre, setGenre] = useState(searchParams.get('genre') ?? '');
  const [sort, setSort] = useState(searchParams.get('sort') ?? 'title');
  const [order, setOrder] = useState(searchParams.get('order') ?? 'asc');
  const [limit, setLimit] = useState(Number(searchParams.get('limit')) || 200);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (genre) params.set('genre', genre);
    params.set('sort', sort);
    params.set('order', order);
    params.set('limit', String(limit));
    router.push(`/?${params.toString()}`);
    setOpen(false);
  };

  return (
    <>
      <Tooltip title="Filter books">
        <IconButton
          color="primary"
          onClick={() => setOpen(true)}
          aria-label="Open filters"
          sx={{
            position: 'fixed',
            bottom: 25,
            right: 25,
            zIndex: 1200,
            bgcolor: 'background.paper',
            boxShadow: 2,
            '&:hover': { bgcolor: 'grey.100' },
          }}
        >
          <TuneIcon />
        </IconButton>
      </Tooltip>

      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: { width: { xs: '80%', sm: 360 }, p: 3 },
        }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: 'flex', flexDirection: 'column', gap: 3, height: '100%' }}
        >
          <Typography variant="h6" fontWeight="bold">
            Filter & Sort
          </Typography>

          <TextField
            select
            label="Genre"
            value={genre}
            onChange={e => setGenre(e.target.value)}
            fullWidth
          >
            {genres.map(opt => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Sort by"
            value={sort}
            onChange={e => setSort(e.target.value)}
            fullWidth
          >
            {sortOptions.map(opt => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Order"
            value={order}
            onChange={e => setOrder(e.target.value)}
            fullWidth
          >
            {orderOptions.map(opt => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            type="number"
            label="Limit"
            value={limit}
            onChange={e => setLimit(Number(e.target.value))}
            inputProps={{ min: 1, max: 500 }}
            fullWidth
          />

          <Box sx={{ flexGrow: 1 }} />

          <Button variant="contained" color="primary" type="submit" fullWidth>
            Apply Filters
          </Button>
        </Box>
      </Drawer>
    </>
  );
};
