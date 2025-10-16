import Grid from '@mui/material/Grid';
import { Book, SearchProps } from '../../types';
import { PaginationControls } from '../../components/pagination-controls';
import { SearchTitle } from '../../components/search-title';
import { SearchCard } from '../../components/search-card';
import { Stack } from '@mui/material';

const SearchPage = async ({ searchParams }: SearchProps) => {
  const { q, limit, offset } = await searchParams;
  const query = q ?? '';
  const limitation = Number(limit ?? 5);
  const offsetting = Number(offset ?? 0);

  const res = await fetch(
    `http://localhost:3001/books/search?q=${encodeURIComponent(query)}&limit=${limitation}&offset=${offsetting}`,
    { next: { revalidate: 30 } }
  );

  const books: Book[] = await res.json();
  const hasResults = books.length > 0;

  return (
    <Grid container spacing={3} justifyContent="center" alignItems="flex-start">
      <Stack spacing={2} width="100%">
        <SearchTitle query={query} hasResults={hasResults} />
        {books.map(book => (
          <SearchCard key={book.id} book={book} />
        ))}
      </Stack>
      {hasResults && (
        <PaginationControls limit={limitation} offset={offsetting} total={books.length} />
      )}
    </Grid>
  );
};

export default SearchPage;
