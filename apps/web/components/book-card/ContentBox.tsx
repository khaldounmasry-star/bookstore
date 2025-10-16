import { FC } from 'react';
import { Book } from '../../types';
import { Box, Typography } from '@mui/material';

export const ContentBox: FC<Book> = ({ title, author }) => (
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
      {title}
    </Typography>
    <Typography variant="body2" sx={{ color: 'white', mb: 2 }}>
      {author}
    </Typography>
  </Box>
);