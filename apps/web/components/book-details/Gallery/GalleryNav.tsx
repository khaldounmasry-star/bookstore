'use client';

import { FC } from 'react';
import { IconButton } from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';

interface GalleryNavProps {
  onPrev: () => void;
  onNext: () => void;
  total: number;
  hasImages: boolean;
}

export const GalleryNav: FC<GalleryNavProps> = ({ onPrev, onNext, total, hasImages }) => {
  if (!hasImages || total <= 1) return null;

  return (
    <>
      <IconButton
        onClick={onPrev}
        aria-label="Previous image"
        aria-keyshortcuts="ArrowLeft"
        sx={{
          position: 'absolute',
          left: '7.5%',
          top: '50%',
          transform: 'translateY(-50%)',
          bgcolor: 'background.paper',
          '&:hover': { bgcolor: 'grey.100' }
        }}
      >
        <ArrowBack />
      </IconButton>

      <IconButton
        onClick={onNext}
        aria-label="Next image"
        aria-keyshortcuts="ArrowRight"
        sx={{
          position: 'absolute',
          right: '7.5%',
          top: '50%',
          transform: 'translateY(-50%)',
          bgcolor: 'background.paper',
          '&:hover': { bgcolor: 'grey.100' }
        }}
      >
        <ArrowForward />
      </IconButton>
    </>
  );
};
