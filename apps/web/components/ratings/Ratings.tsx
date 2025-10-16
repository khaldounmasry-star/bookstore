import { Rating } from '@mui/material';
import { Book } from '../../types';

export const Ratings = ({ book }: { book: Book }) => (
  <Rating
    name="ratings"
    defaultValue={book.rating}
    sx={{ marginTop: 1 }}
    precision={0.5}
    size="large"
    readOnly
  />
);
