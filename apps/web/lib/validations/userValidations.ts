import { UserFormErrors, UserFormValues } from '../../types';

export const validateUser = (values: UserFormValues): UserFormErrors => {
  const { signIn = false, update = false, firstName, lastName, email, password } = values;
  const errors: UserFormErrors = {};
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!signIn) {
    if (!firstName?.trim()) {
      errors.firstName = 'First name is required';
    }

    if (!lastName?.trim()) {
      errors.lastName = 'Last name is required';
    }
  }

  if (!email.trim()) {
    errors.email = 'Email is required';
  } else if (!emailRegex.test(email)) {
    errors.email = 'Invalid email format';
  }

  if (!update) {
    if (!password?.trim()) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
  }

  return errors;
};
