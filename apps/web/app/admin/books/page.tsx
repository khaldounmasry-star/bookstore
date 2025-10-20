import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { Role } from '../../../types';
import { redirect } from 'next/navigation';
import { booksApi, getCurrentUser } from '../../../lib';
import { BooksTable } from '../../../components/admin/books-table';

export default async function AdminBooksPage() {
  const { role } = (await getCurrentUser()) ?? { role: Role.EMPTY, token: '' };

  if (![Role.ADMIN, Role.SUPER_ADMIN].includes(role)) redirect('/');

  const books = await booksApi.fetchBooks();

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
        <Typography variant="h5" fontWeight={600}>
          Manage Books
        </Typography>
        <Button variant="contained" color="primary">
          Add Book
        </Button>
      </Stack>
      <Typography color="text.secondary" mb={2}>
        Only admins can manage books.
      </Typography>
      <BooksTable books={books} />
    </Box>
  );
}
