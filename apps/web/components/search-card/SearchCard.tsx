import { Card, Box, Typography, Avatar } from '@mui/material';
import type { Book } from '../../types';
import Link from 'next/link';
import { Ratings } from '../ratings';

export const SearchCard = ({ book }: { book: Book }) => {
  return (
    <Link href={`/books/${book.id}`} style={{ textDecoration: 'none' }}>
      <Card
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: 2,
          borderRadius: 3,
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          transition: 'all 0.2s ease',
          '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 6px 18px rgba(0,0,0,0.12)' }
        }}
      >
        <Avatar
          src={book.covers[0]?.imageUrl ?? '/placeholder.jpg'}
          alt={book.title}
          sx={{ width: 64, height: 64, borderRadius: '50%', mr: 2 }}
        />

        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" color="text.primary" noWrap>
            {book.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {book.author}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {book.year}
          </Typography>
          <Ratings book={book} />
        </Box>
      </Card>
    </Link>
  );
};
