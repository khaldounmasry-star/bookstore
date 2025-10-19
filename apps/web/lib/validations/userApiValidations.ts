import { ApiError } from '../api';
import { FieldErrorSetter, SnackbarSetter } from '../../types';

export const handleUserApiError = (
  error: unknown,
  setFieldError?: FieldErrorSetter,
  showAlert?: SnackbarSetter
): void => {
  if (!(error instanceof ApiError)) {
    console.error('Unexpected error:', error);
    showAlert?.('Unexpected error occurred. Please try again.', 'error');
    return;
  }

  if (error.isValidationError()) {
    error.issues?.forEach(issue => {
      const path = Array.isArray(issue.path) ? issue.path.join('.') : (issue.path ?? 'unknown');
      setFieldError?.(path, issue.message);
    });
    return;
  }

  if (error.status === 409) {
    setFieldError?.('email', 'An account with this email already exists');
    return;
  }

  if (error.status === 401) {
    if (error.message.includes('email')) {
      setFieldError?.('email', 'Invalid email');
    } else {
      setFieldError?.('password', 'Invalid password');
    }
    return;
  }

  console.error('API error:', error);
  showAlert?.(error.message || 'Unexpected error occurred.', 'error');
};
