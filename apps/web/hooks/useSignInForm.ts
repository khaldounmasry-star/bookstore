'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usersApi, ApiError, ApiClient, setCookie } from '../lib';
import { Role } from '../types';

export const useSignInForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  const resetErrors = () => {
    setEmailError('');
    setPasswordError('');
  };

  const validateFields = (): boolean => {
    resetErrors();
    let hasError = false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
    }

    return !hasError;
  };

  const handleSubmit = async (): Promise<void> => {
    if (!validateFields()) return;

    try {
      setIsSubmitting(true);
      const { token: apiToken, role } = await usersApi.login({ email, password });

      setCookie('token', apiToken);
      setCookie('role', role);

      const client = new ApiClient();
      client.setToken(apiToken);

      router.push(role === Role.USER ? '/' : '/admin');
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.isValidationError()) {
          error.issues?.forEach(issue => {
            if (issue.path === 'email') setEmailError(issue.message);
            if (issue.path === 'password') setPasswordError(issue.message);
          });
          return;
        }

        if (error.status === 401) {
          if (error.message.includes('email')) {
            setEmailError('Invalid email');
          } else {
            setPasswordError('Invalid password');
          }
          return;
        }
      }

      console.error('Unexpected login error:', error);
      alert('Unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    values: { email, password },
    errors: { emailError, passwordError },
    isSubmitting,
    handlers: { setEmail, setPassword, handleSubmit }
  };
};
