export interface Cover {
  imageUrl: string;
}

export interface Book {
  id: number;
  title: string;
  author: string;
  year: number;
  rating: number;
  genre: string;
  covers: Cover[];
  price: number;
  description: string;
}

export interface SearchProps {
  searchParams: {
    q?: string;
    limit?: string;
    offset?: string;
  };
}

export type BookDetailProps = {
  book: Book;
};

export type GalleryDisplayProps = {
  covers: Book['covers'];
  title: string;
  currentImage: number;
  direction: number;
};
