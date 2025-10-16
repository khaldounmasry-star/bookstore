'use client';

import { Drawer, Box, TextField, MenuItem, Button, Typography } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

const sortOptions = [
  { label: 'Title', value: 'title' },
  { label: 'Price', value: 'price' },
  { label: 'Rating', value: 'rating' }
];

const orderOptions = [
  { label: 'Ascending', value: 'asc' },
  { label: 'Descending', value: 'desc' }
];

interface SearchFilterDrawerProps {
  genres: string[];
  open: boolean;
  onClose: () => void;
}

export const SearchFilterDrawer = ({ genres, open, onClose }: SearchFilterDrawerProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [genre, setGenre] = useState(searchParams.get('genre') ?? '');
  const [sort, setSort] = useState(searchParams.get('sort') ?? '');
  const [order, setOrder] = useState(searchParams.get('order') ?? 'asc');
  const [limit, setLimit] = useState(Number(searchParams.get('limit')) || 200);

  const handleReset = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setGenre('');
    setSort('');
    setOrder('asc');
    setLimit(200);
    router.push('/');
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (genre) params.set('genre', genre);
    if (sort) params.set('sort', sort);
    if (sort && order) params.set('order', order);
    params.set('limit', String(limit));
    router.push(`/?${params.toString()}`);
    onClose();
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { width: { xs: '80%', sm: 360 }, p: 3 }
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          height: '100%'
        }}
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
          {genres?.map(opt => (
            <MenuItem key={opt} value={opt}>
              {opt}
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
        <Button variant="outlined" color="primary" fullWidth onClick={handleReset}>
          Reset Filters
        </Button>
        <Button variant="contained" color="primary" type="submit" fullWidth>
          Apply Filters
        </Button>
      </Box>
    </Drawer>
  );
};
