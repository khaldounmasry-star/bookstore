import Grid from '@mui/material/Grid';
import { Book, SearchProps } from '../../types';
import { SearchCard } from '../../components/search-card';
import Stack from '@mui/material/Stack';
import { Typography } from '@mui/material';

const SearchPage = async ({ searchParams }: SearchProps) => {
  const { q, limit, offset } = await searchParams;
  const query = q ?? '';
  const limitation = limit ?? 5;
  const offsetting = offset ?? 0;

  const res = await fetch(
    `http://localhost:3001/books/search?q=${encodeURIComponent(query)}&limit=${limitation}&offset=${offsetting}`,
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
