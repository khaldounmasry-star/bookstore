import * as React from 'react';
import {
  Card,
  CardActionArea,
  Box,
  Typography,
} from '@mui/material';
import Image from 'next/image';

interface Book {
  id: number;
  title: string;
  author: string;
  cover?: string;
}

export const BookCard = ({ book }: { book: Book }) => {
  return (
    <Card
      sx={{
        position: 'relative',
        borderRadius: 4,
        overflow: 'hidden',
        boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
        height: 380,
      }}
    >
      <CardActionArea sx={{ height: '100%', position: 'relative' }}>
        {/* Image */}
        <Box
          sx={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 2,
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 12px 32px rgba(0,0,0,0.15)',
            },
            '& img': {
              transition: 'transform 0.5s ease',
              transformOrigin: 'center center',
            },
            '&:hover img': {
              transform: 'scale(1.1)',
            },
          }}
        >
          <Image
            src={book.cover ?? `https://picsum.photos/seed/book-${book.id}/600/900`}
            alt={book.title}
            width={300}
            height={600}
            style={{ width: '100%', height: 'auto', objectFit: 'cover', display: 'block' }}
          />
        </Box>

        {/* BLUR LAYER */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '45%',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            WebkitMaskImage:
              'linear-gradient(to top, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)',
            maskImage:
              'linear-gradient(to top, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)',
            zIndex: 1,
          }}
        />

        {/* DARK GRADIENT LAYER */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '45%',
            background:
              'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0) 100%)',
            zIndex: 2,
          }}
        />

        {/* CONTENT */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 3,
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            color: 'white',
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
            {book.title}
          </Typography>
          <Typography variant="body2" sx={{ color: 'white', mb: 2 }}>
            {book.author}
          </Typography>
        </Box>
      </CardActionArea>
    </Card>
  );
}
