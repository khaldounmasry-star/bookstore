/* eslint-disable @typescript-eslint/no-explicit-any */

export interface Cover {
  id: number;
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
  sku: string;
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
  EMPTY = '',
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
  role?: string | null;
  login: (token: string, role: string) => void;
  logout: () => void;
}

export interface SideBarProps {
  role: 'ADMIN' | 'SUPER_ADMIN';
}

export type SideBarToggleProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
};

export type UsersTableProps = {
  users: User[];
};

export type NewUserPayload = Omit<User, 'id' | 'role'> & { password: string };

export type CreateAdminResponse = {
  message: string;
  admin: User;
};

export type UpdateUserResponse = {
  message: string;
  user: User;
};

export type UserFormValues = {
  signIn?: boolean;
  update?: boolean;
  firstName?: string;
  lastName?: string;
  email: string;
  password?: string;
};

export type UserFormErrors = Partial<Record<keyof UserFormValues, string>>;

export type FieldErrorSetter = (field: string, message: string) => void;

export type SnackbarSetter = (message: string, severity?: 'error' | 'success') => void;

export type AlertSeverity = 'error' | 'success';

export type AlertState = {
  message: string;
  severity: AlertSeverity;
};

export type AddUserModalProps = {
  open: boolean;
  setAlert: React.Dispatch<React.SetStateAction<AlertState | undefined>>;
  onClose: () => void;
  onSubmit: (data: NewUserPayload) => Promise<void> | void;
};

export type UpdateUserModalProps = {
  user: User;
  open: boolean;
  setAlert: React.Dispatch<React.SetStateAction<AlertState | undefined>>;
  onClose: () => void;
  onSubmit: (data: User) => Promise<void> | void;
};

export type ConfirmationModalProps = {
  open: boolean;
  title?: string;
  message: string | React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  onConfirm: () => void | Promise<void>;
  onClose: () => void;
};

type Callback = () => void;

export type NotificationProps = {
  callbacks: Callback[];
  success: boolean;
  successMessage: string;
  alert?: AlertState;
};

export type PageProps = {
  params: Promise<any> | undefined;
  searchParams: Promise<any> | undefined;
};

export type BooksTableProps = {
  books: Book[];
};

export type Column = { id: keyof Book; label: string; numeric?: boolean };

export interface CoverListProps {
  books: Book[];
  selectedBookId: number;
}

export interface CoversManagerProps {
  books: Book[];
}
