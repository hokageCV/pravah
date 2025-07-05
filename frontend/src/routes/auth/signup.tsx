import * as React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Signup } from '../../components/auth/Signup';

export const Route = createFileRoute('/auth/signup')({
  component: Signup,
});
