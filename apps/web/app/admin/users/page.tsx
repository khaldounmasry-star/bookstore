import { redirect } from 'next/navigation';
import { getCurrentUser } from '../../../lib';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export default async function AdminUsersPage() {
  const user = await getCurrentUser();
  if (user?.role !== 'SUPER_ADMIN') redirect('/admin');

  return (
    <Box>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Manage Users
      </Typography>
      <Typography color="text.secondary">Only super admins can manage users.</Typography>
    </Box>
  );
}
