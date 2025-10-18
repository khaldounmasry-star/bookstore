import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

export default function AdminBooksPage() {
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
      <Typography color="text.secondary">
        Here you’ll be able to view, edit, and delete books.
      </Typography>
    </Box>
  );
}
