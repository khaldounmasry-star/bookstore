'use client';

import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Grid from '@mui/material/Grid';

export const Loading = ({ count = 8 }: { count?: number }) => {
  return (
    <Grid container spacing={4}>
      {Array.from({ length: count }).map((_, i) => (
        <Grid
          key={i}
          size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
          sx={{ display: 'flex', justifyContent: 'center' }}
        >
          <Box
            sx={{
              width: '100%',
              maxWidth: 320,
              borderRadius: 3,
              overflow: 'hidden',
              boxShadow: 2,
              bgcolor: 'background.paper'
            }}
          >
            {/* Cover */}
            <Skeleton
              variant="rectangular"
              height={220}
              animation="wave"
              sx={{ borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
            />

            {/* Content */}
            <Box sx={{ p: 2 }}>
              <Skeleton variant="text" width="60%" height={28} />
              <Skeleton variant="text" width="40%" height={20} />
              <Skeleton variant="text" width="80%" height={20} sx={{ mt: 1 }} />
              <Skeleton variant="text" width="30%" height={24} sx={{ mt: 2 }} />
            </Box>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};
