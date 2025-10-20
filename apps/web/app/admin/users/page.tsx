import { redirect } from 'next/navigation';
import { getCurrentUser, usersApi } from '../../../lib';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { UsersTable } from '../../../components/admin/users-table';
import { AddUser } from '../../../components/admin/user-form';
import { Role } from '../../../types';

export default async function AdminUsersPage() {
  const user = await getCurrentUser();
  if (user?.role !== Role.SUPER_ADMIN) redirect('/admin');

  const users = await usersApi.fetchUsers();

  return (
    <Box>
      <Typography variant="h5" fontWeight={600} mb={3}>
        Manage Users
      </Typography>
      <Typography color="text.secondary" mb={2}>
        Only super admins can manage users.
      </Typography>
      <AddUser />
      <UsersTable users={users} />
    </Box>
  );
}
