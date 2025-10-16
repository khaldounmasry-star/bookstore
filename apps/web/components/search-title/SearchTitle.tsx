import { Typography, Box } from '@mui/material';

export const SearchTitle = ({ query, hasResults }: { query: string; hasResults: boolean }) => (
  <Typography variant="h5" color="text.primary" textAlign="center">
    {hasResults ? (
      <>
        Search Results for{' '}
        <Box component="span" fontWeight="bold" fontStyle="italic">
          &quot;{query}&quot;
        </Box>
      </>
    ) : (
      <>
        🧐 Nothing matched your search{' '}
        <Box component="span" fontWeight="bold" fontStyle="italic">
          ({query})
        </Box>
        <br />
        🧐 maybe your book is still being written?
      </>
    )}
  </Typography>
);
