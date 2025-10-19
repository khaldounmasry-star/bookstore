import Grid from '@mui/material/Grid';
import { BookCard } from '../components/book-card';
import { SearchFilter } from '../components/search-filter';
import { Stack, Typography } from '@mui/material';
import { Loading } from '../components/loading';
import { booksApi } from '../lib/api';
import { PageProps } from '../types';

export const revalidate = 60;

export default async function Home({ searchParams }: PageProps) {
  const {
    genre = '',
    sort = 'rating',
    order = 'desc',
    limit = 16,
    offset = 0
  } = (await searchParams) ?? {};

  const res = await booksApi.filterBooks({
    genre,
    sort,
    order,
    limit: Number(limit),
    offset: Number(offset)
  });
  const { results, genres } = res;

  if (!results || !genres) {
    return <Loading />;
  }

  return (
    <Stack spacing={4} sx={{ width: '100%', p: 4 }}>
      <Typography variant="h4" textAlign="center" fontWeight="bold">
        Explore Our Collection
      </Typography>
      <SearchFilter genres={genres} />
      <Grid
        container
        spacing={3}
        justifyContent="center"
        alignItems="flex-start"
        sx={{ width: '100%', margin: '0 auto' }}
      >
        {results.map(book => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={book.id}>
            <BookCard book={book} />
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
}
