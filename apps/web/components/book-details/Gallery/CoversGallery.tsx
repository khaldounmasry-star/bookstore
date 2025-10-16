'use client';

import { FC, useState } from 'react';
import { Box } from '@mui/material';
import { Book } from '../../../types';
import { GalleryDisplay } from './GalleryDisplay';
import { GalleryNav } from './GalleryNav';

export const CoversGallery: FC<{ covers: Book['covers']; title: string }> = ({ covers, title }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [direction, setDirection] = useState(0);
  const hasImages = covers && covers.length > 0;

  const nextImage = () => {
    setDirection(1);
    setCurrentImage((prev) => (prev + 1) % covers.length);
  };

  const prevImage = () => {
    setDirection(-1);
    setCurrentImage((prev) => (prev - 1 + covers.length) % covers.length);
  };

  return (
    <Box
      sx={{
        position: 'relative',
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <GalleryDisplay covers={covers} title={title} currentImage={currentImage} direction={direction} />
      <GalleryNav onPrev={prevImage} onNext={nextImage} total={covers.length} hasImages={hasImages} />
    </Box>
  );
};
