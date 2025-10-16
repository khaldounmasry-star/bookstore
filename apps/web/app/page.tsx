import Grid from '@mui/material/Grid';
import { BookCard } from '../components/book-card';
import { Book } from '../types';

export default async function Home() {
  const res = await fetch('http://localhost:3001/books', {
    next: { revalidate: 60 }
  });

  if (!res.ok) {
    throw new Error('Failed to fetch books');
  }

  const books: Book[] = await res.json();

  return (
    <Grid
      container
      spacing={3}
      justifyContent="center"
      alignItems="flex-start"
      sx={{ width: '100%', margin: '0 auto' }}
    >
      {books.map(book => (
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={book.id}>
          <BookCard book={book} />
        </Grid>
      ))}
    </Grid>
  );
}
