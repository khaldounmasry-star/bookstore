import { FC } from 'react';
import {
  Typography,
  Rating,
  Stack,
  Button,
  Chip,
} from '@mui/material';

import { Book } from '../../types';

export const BookContent: FC<Book> = ({ title, rating, author, genre, description, price, year }) => (
  <Stack spacing={2} flex={1}>
    <Typography variant="h4" fontWeight="bold">
      {title}
    </Typography>

        <Typography variant="subtitle1" color="text.secondary">
          {author} • {year}
        </Typography>

        <Stack direction="row" alignItems="center" spacing={1}>
          <Rating name="book-rating" value={rating} precision={0.5} readOnly />
          <Typography variant="body2" color="text.secondary">
            ({rating.toFixed(1)})
          </Typography>
        </Stack>

        <Chip label={genre} color="primary" variant="outlined" sx={{ width: 'fit-content' }} />

        <Typography variant="body1" sx={{ mt: 2 }}>
          {description ?? 'No description available.'}
        </Typography>

        <Typography variant="h6" sx={{ mt: 2 }}>
          Price: £{price ?? 'N/A'}
        </Typography>

        <Button variant="contained" color="primary" size="large" sx={{ width: 'fit-content' }}>
          Add to Cart
        </Button>
      </Stack>
);

