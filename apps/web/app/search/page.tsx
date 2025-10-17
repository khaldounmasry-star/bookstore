import { Box, Stack, Grid } from '@mui/material';
import { PaginationControls } from '../../components/pagination-controls';
import { SearchTitle } from '../../components/search-title';
import { SearchCard } from '../../components/search-card';
import { booksApi } from '../../lib/api';
import { SearchProps } from '../../types';

const SearchPage = async ({ searchParams }: SearchProps) => {
  const { q, limit, offset } = await searchParams;
  const query = q ?? '';
  const limitation = Number(limit ?? 5);
  const offsetting = Number(offset ?? 0);

  const books = await booksApi.searchBooks({ q: query, limit: limitation, offset: offsetting });
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
        <Box
          sx={{
            display: 'flex',
            position: 'fixed',
            bottom: 25,
            zIndex: 1200,
            alignContent: 'center',
            justifyContent: 'center'
          }}
        >
          <PaginationControls limit={limitation} offset={offsetting} total={books.length} />
        </Box>
      )}
    </Grid>
  );
};

export default SearchPage;
