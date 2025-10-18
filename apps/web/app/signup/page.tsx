import { Box } from '@mui/material';
import { redirect } from 'next/navigation';
import { SignUpForm } from '../../components/forms';
import { Role } from '../../types';
import { getCurrentUser } from '../../lib';

export default async function SignUpPage() {
  const user = await getCurrentUser();

  if (user?.role) {
    redirect(user.role === Role.USER ? '/' : '/admin');
  }

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
      <SignUpForm />
    </Box>
  );
}
