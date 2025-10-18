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

export interface PaginationControlsProps {
  limit: number;
  offset: number;
  total: number;
}

export interface FilterResults {
  genres: string[];
  results: Book[];
  total: number;
}

export interface SearchFilterDrawerProps {
  genres: string[];
  open: boolean;
  onClose: () => void;
}

export enum Role {
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
  USER = 'USER'
}

export type LoginResponse = {
  message: string;
  token: string;
  role: Role;
};

export type SignUpResponse = {
  message: string;
  token: string;
};

export interface ValidationIssue {
  path: string | string[];
  message: string;
}

export type CurrentUser = {
  token: string;
  role: Role;
};

export interface AuthContextType {
  isAuthenticated: boolean;
  token?: string | null;
  login: (token: string, role: string) => void;
  logout: () => void;
}

export interface SideBarProps {
  role: 'ADMIN' | 'SUPER_ADMIN';
};

export type SideBarToggleProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
