import { notFound } from 'next/dist/client/components/navigation';
import { BookDetails } from '../../../components/book-details';
import { booksApi } from '../../../lib/api';
import { ApiError } from '../../../lib/api/error';
import { PageProps } from '../../../types';

export default async function BookPage({ params }: PageProps) {
  const { id } = await params;

  try {
    const book = await booksApi.getBook(Number(id));

    return <BookDetails book={book} />;
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.isNotFoundError()) {
        notFound();
      }

      return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h2>Something went wrong</h2>
          <p>{error.message}</p>
        </div>
      );
    }
  }
}
