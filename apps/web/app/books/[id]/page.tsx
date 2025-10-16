import { BookDetails } from '../../../components/book-details';
import { Book } from '../../../types';

export const revalidate = 30;

const BookPage = async ({ params }: { params: { id: string } }) => {
  const { id } = await params;

  const res = await fetch(`http://localhost:3001/books/${id}`, {
    next: { revalidate: 30 }
  });

  if (!res.ok) {
    return (
      <div style={{ padding: 40 }}>
        <h2>Book not found</h2>
      </div>
    );
  }

  const book: Book = await res.json();

  return <BookDetails book={book} />;
};

export default BookPage;
