'use client';

import { useState } from 'react';
import { Box, Typography, Rating, Stack, IconButton, CardMedia, Button, Chip } from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { Book } from '../../types';

interface BookDetailProps {
  book: Book;
}

export const BookDetails = ({ book }: BookDetailProps) => {
  const [currentImage, setCurrentImage] = useState(0);
  const hasImages = book.covers && book.covers.length > 0;

  const nextImage = () => setCurrentImage((prev) => (prev + 1) % book.covers.length);
  const prevImage = () => setCurrentImage((prev) => (prev - 1 + book.covers.length) % book.covers.length);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: 4,
        p: 4,
        maxWidth: 1200,
        mx: 'auto',
      }}
    >
      {/* Image Section */}
      <Box
        sx={{
          position: 'relative',
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {hasImages ? (
          <>
            <CardMedia
              component="img"
              image={book?.covers?.[currentImage]?.imageUrl ?? '/placeholder.jpg'}
              alt={book.title}
              sx={{
                width: '100%',
                maxWidth: 400,
                height: 'auto',
                borderRadius: 3,
                boxShadow: 3,
                objectFit: 'cover',
              }}
            />

            {book.covers.length > 1 && (
              <>
                <IconButton
                  onClick={prevImage}
                  sx={{
                    position: 'absolute',
                    left: 16,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    bgcolor: 'background.paper',
                  }}
                >
                  <ArrowBack />
                </IconButton>
                <IconButton
                  onClick={nextImage}
                  sx={{
                    position: 'absolute',
                    right: 16,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    bgcolor: 'background.paper',
                  }}
                >
                  <ArrowForward />
                </IconButton>
              </>
            )}
          </>
        ) : (
          <Typography>No Image Available</Typography>
        )}
      </Box>

      {/* Content Section */}
      <Stack spacing={2} flex={1}>
        <Typography variant="h4" fontWeight="bold">
          {book.title}
        </Typography>

        <Typography variant="subtitle1" color="text.secondary">
          {book.author} • {book.year}
        </Typography>

        <Stack direction="row" alignItems="center" spacing={1}>
          <Rating name="book-rating" value={book.rating} precision={0.5} readOnly />
          <Typography variant="body2" color="text.secondary">
            ({book.rating.toFixed(1)})
          </Typography>
        </Stack>

        <Chip label={book.genre} color="primary" variant="outlined" sx={{ width: 'fit-content' }} />

        <Typography variant="body1" sx={{ mt: 2 }}>
          {book.description ?? 'No description available.'}
        </Typography>

        <Typography variant="h6" sx={{ mt: 2 }}>
          Price: £{book.price ?? 'N/A'}
        </Typography>

        <Button variant="contained" color="primary" sx={{ mt: 2, width: 'fit-content' }}>
          Add to Cart
        </Button>
      </Stack>
    </Box>
  );
};
