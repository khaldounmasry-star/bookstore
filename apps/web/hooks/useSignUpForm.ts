'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { setCookie, usersApi, ApiError, validateUser } from '../lib';

export const useSignUpForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  const resetErrors = () => {
    setEmailError('');
    setPasswordError('');
    setFirstNameError('');
    setLastNameError('');
  };

  const validateFields = (): boolean => {
    const validation = validateUser({ firstName, lastName, email, password });
    resetErrors();

    Object.entries(validation).forEach(([field, message]) => {
      switch (field) {
        case 'firstName':
          setFirstNameError(message!);
          break;
        case 'lastName':
          setLastNameError(message!);
          break;
        case 'email':
          setEmailError(message!);
          break;
        case 'password':
          setPasswordError(message!);
          break;
      }
    });

    return Object.keys(validation).length === 0;
  };

  const handleSubmit = async (): Promise<void> => {
    if (!validateFields()) return;

    try {
      setIsSubmitting(true);
      const { token: apiToken } = await usersApi.register({ firstName, lastName, email, password });
      setCookie('token', apiToken);
      setCookie('role', 'USER');
      router.push('/');
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.isValidationError()) {
          error.issues?.forEach(issue => {
            switch (issue.path) {
              case 'firstName':
                setFirstNameError(issue.message);
                break;
              case 'lastName':
                setLastNameError(issue.message);
                break;
              case 'email':
                setEmailError(issue.message);
                break;
              case 'password':
                setPasswordError(issue.message);
                break;
            }
          });
          return;
        }

        if (error.status === 409) {
          setEmailError('An account with this email already exists');
          return;
        }
      }

      console.error('Unexpected signup error:', error);
      alert('Unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    values: { email, password, firstName, lastName },
    errors: { emailError, passwordError, firstNameError, lastNameError },
    isSubmitting,
    handlers: {
      setEmail,
      setPassword,
      setFirstName,
      setLastName,
      handleSubmit
    }
  };
};
