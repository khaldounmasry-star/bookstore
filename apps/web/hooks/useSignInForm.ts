'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usersApi, ApiClient, setCookie, validateUser, handleUserApiError } from '../lib';
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
    const validation = validateUser({ email, password, signIn: true });
    resetErrors();

    Object.entries(validation).forEach(([field, message]) => {
      switch (field) {
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
      const { token: apiToken, role } = await usersApi.login({ email, password });

      setCookie('token', apiToken);
      setCookie('role', role);

      const client = new ApiClient();
      client.setToken(apiToken);

      router.push(role === Role.USER ? '/' : '/admin');
    } catch (error) {
      handleUserApiError(error, (field, message) => {
        if (field === 'email') setEmailError(message);
        if (field === 'password') setPasswordError(message);
      });
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
