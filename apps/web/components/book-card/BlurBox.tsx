import { FC } from "react";
import { Box } from '@mui/material';

export const BlurBox: FC = () => (
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
);