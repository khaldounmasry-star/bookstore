import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Role } from '../../../../types';
import { redirect } from 'next/navigation';
import { booksApi, getCurrentUser } from '../../../../lib';
import { Button, Stack } from '@mui/material';
import { CoversManager } from '../../../../components/admin/cover-manager';

export default async function AdminBookCoversPage() {
  const { role } = (await getCurrentUser()) ?? { role: Role.EMPTY, token: '' };

  if (![Role.ADMIN, Role.SUPER_ADMIN].includes(role)) redirect('/');

  const books = await booksApi.fetchBooks();

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
        <Typography variant="h5" fontWeight={600}>
          Manage Covers
        </Typography>
        <Button variant="contained" color="primary">
          Add Cover
        </Button>
      </Stack>
      <Typography color="text.secondary" mb={2}>
        Only admins can manage cover - <strong>Only delete and update work</strong>.
      </Typography>
      <CoversManager books={books} />
    </Box>
  );
}
