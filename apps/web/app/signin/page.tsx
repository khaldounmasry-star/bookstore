import { Box } from '@mui/material';
import { SignInForm } from '../../components/forms';
import { redirect } from 'next/navigation';
import { Role } from '../../types';
import { getCurrentUser } from '../../lib';

export default async function SignInPage() {
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
      <SignInForm />
    </Box>
  );
}
