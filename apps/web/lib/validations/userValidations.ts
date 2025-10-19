export type UserFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export type UserFormErrors = Partial<Record<keyof UserFormValues, string>>;

export const validateUser = (values: UserFormValues): UserFormErrors => {
  const errors: UserFormErrors = {};
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!values.firstName.trim()) {
    errors.firstName = 'First name is required';
  }

  if (!values.lastName.trim()) {
    errors.lastName = 'Last name is required';
  }

  if (!values.email.trim()) {
    errors.email = 'Email is required';
  } else if (!emailRegex.test(values.email)) {
    errors.email = 'Invalid email format';
  }

  if (!values.password.trim()) {
    errors.password = 'Password is required';
  } else if (values.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }

  return errors;
};
