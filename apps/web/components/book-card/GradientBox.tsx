import { FC } from "react";
import { Box } from '@mui/material';

export const GradientBox: FC = () => (
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
);
