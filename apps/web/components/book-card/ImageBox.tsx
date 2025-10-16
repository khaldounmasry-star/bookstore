import { FC } from 'react';
import { Box } from '@mui/material';
import Image from 'next/image';
import { Book } from '../../types';

export const ImageBox: FC<Book> = ({ id, covers, title }) => (
  <Box
    sx={{
      position: 'relative',
      overflow: 'hidden',
      borderRadius: 2,
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 12px 32px rgba(0,0,0,0.15)'
      },
      '& img': {
        transition: 'transform 0.5s ease',
        transformOrigin: 'center center'
      },
      '&:hover img': {
        transform: 'scale(1.1)'
      }
    }}
  >
    <Image
      src={covers[0]?.imageUrl ?? `https://picsum.photos/seed/book-${id}/500/800`}
      alt={title}
      width={500}
      height={800}
      style={{ width: '100%', height: 'auto', objectFit: 'cover', display: 'block' }}
    />
  </Box>
);
