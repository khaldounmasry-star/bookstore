'use client';

import { Box } from '@mui/material';
import { SignInForm } from '../../components/forms';

export default function SignInPage() {
  return (
    <Box
      sx={{
        minHeight: '85vh',
        display: 'flex',
        alignItems: { sm: 'flex-start', md: 'center' },
        justifyContent: 'center',
        bgcolor: 'background.default',
        p: 2,
        overflowY: 'auto'
      }}
    >
      <SignInForm />
    </Box>
  );
}
