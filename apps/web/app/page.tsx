import Grid from '@mui/material/Grid';
import { Book, FilterResults } from '../types';
import { BookCard } from '../components/book-card';
import { SearchFilter } from '../components/search-filter';
import { Stack, Typography } from '@mui/material';

export const revalidate = 60;

interface HomeProps {
  searchParams?: {
    genre?: string;
    sort?: string;
    order?: string;
    limit?: string;
    offset?: string;
  };
}

export default async function Home({ searchParams }: HomeProps) {
  const {
    genre = '',
    sort = 'title',
    order = 'asc',
    limit = 200,
    offset = 0
  } = (await searchParams) ?? {};

  const params = new URLSearchParams({
    ...(genre && { genre }),
    sort,
    order,
    limit: String(limit),
    offset: String(offset)
  });

  const res = await fetch(`http://localhost:3001/books/filter?${params.toString()}`, {
    next: { revalidate: 60 }
  });

  if (!res.ok) {
    throw new Error('Failed to fetch books');
  }

  const filterRes: FilterResults = await res.json();
  const { results } = filterRes;
  const genres = [...new Set(results.map((book: Book) => book.genre))];

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
