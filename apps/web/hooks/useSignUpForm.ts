'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { setCookie, usersApi, ApiError } from '../lib';

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
    let hasError = false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    resetErrors();

    if (!firstName.trim()) {
      setFirstNameError('First name is required');
      hasError = true;
    }

    if (!lastName.trim()) {
      setLastNameError('Last name is required');
      hasError = true;
    }

    if (!email.trim()) {
      setEmailError('Email is required');
      hasError = true;
    } else if (!emailRegex.test(email)) {
      setEmailError('Invalid email format');
      hasError = true;
    }

    if (!password.trim()) {
      setPasswordError('Password is required');
      hasError = true;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      hasError = true;
    }

    return !hasError;
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
