import { redirect } from 'next/navigation';
import { getCurrentUser, usersApi } from '../../../lib';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { UsersTable } from '../../../components/admin/users-table';
import { Button, Stack } from '@mui/material';

export default async function AdminUsersPage() {
  const user = await getCurrentUser();
  if (user?.role !== 'SUPER_ADMIN') redirect('/admin');
  const users = await usersApi.fetchUsers();

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
        <Typography variant="h5" fontWeight={600}>
          Manage Users
        </Typography>
        <Button variant="contained" color="primary">
          Add User
        </Button>
      </Stack>
      <Typography color="text.secondary">Only super admins can manage users.</Typography>
      <UsersTable users={users} />
    </Box>
  );
}
