'use client';

import { FC } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, CardMedia, Typography } from '@mui/material';
import { GalleryDisplayProps } from '../../../types';

export const GalleryDisplay: FC<GalleryDisplayProps> = ({ covers, title, currentImage, direction }) => {
  const hasImages = covers && covers.length > 0;

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 500,
        aspectRatio: '2 / 3',
        borderRadius: 3,
        boxShadow: 3,
        overflow: 'hidden',
        backgroundColor: 'rgba(0,0,0,0.04)',
        position: 'relative',
      }}
    >
      {hasImages ? (
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentImage}
            custom={direction}
            variants={{
              enter: (dir: number) => ({
                x: dir > 0 ? 40 : -40,
                opacity: 0,
              }),
              center: {
                x: 0,
                opacity: 1,
              },
              exit: (dir: number) => ({
                x: dir > 0 ? -40 : 40,
                opacity: 0,
              }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
            }}
          >
            <CardMedia
              component="img"
              image={covers?.[currentImage]?.imageUrl ?? '/placeholder.jpg'}
              alt={title}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </motion.div>
        </AnimatePresence>
      ) : (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          No Image Available
        </Typography>
      )}
    </Box>
  );
};
