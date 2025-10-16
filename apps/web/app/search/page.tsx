import Grid from '@mui/material/Grid';
import { Book, SearchProps } from '../../types';
import { SearchCard } from '../../components/search-card';
import Stack from '@mui/material/Stack';
import { Typography } from '@mui/material';

const SearchPage = async ({ searchParams }: SearchProps) => {
  const q = searchParams.q ?? '';
  const limit = searchParams.limit ?? 5;
  const offset = searchParams.offset ?? 0;

  const res = await fetch(
    `http://localhost:3001/books/search?q=${encodeURIComponent(q)}&limit=${limit}&offset=${offset}`,
    { next: { revalidate: 30 } }
  );

  const books: Book[] = await res.json();

  return (
    <Grid container spacing={3}>
      <Stack spacing={2} width="100%">
        <Typography variant="h5" color="text.primary">
          Results for &quot;{q}&quot;
        </Typography>
        {books.map((book) => (
          <SearchCard key={book.id} book={book} />
        ))}
      </Stack>
    </Grid>
  );
};

export default SearchPage;
