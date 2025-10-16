import { Box } from '@mui/material';
import { Book } from '../../types';
import { CoversGallery } from './Gallery';
import { BookContent } from './BookContent';

export const BookDetails = ({ book }: { book: Book }) => (
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
    <CoversGallery {...book} />
    <BookContent {...book} />
  </Box>
);
