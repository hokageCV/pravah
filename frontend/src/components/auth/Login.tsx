import { useMutation } from '@tanstack/react-query';
import { Link, useRouter } from '@tanstack/react-router';
import { type FormEvent, useState } from 'react';
import { BASE_URL } from '../../constants';
import { useAuthStore } from './auth.store';
import { PasswordInput } from './password';

export function Login() {
  let [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  let setUser = useAuthStore((state) => state.setUser);
  let setToken = useAuthStore((state) => state.setToken);

  let router = useRouter();

  let mutation = useMutation({
    mutationFn: async (formData: { email: string; password: string }) => {
      let res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Login failed');

      let headers = res.headers;
      let client = headers.get('client') || '';
      let accessToken = headers.get('access-token') || '';
      let uid = headers.get('uid') || '';
      let data = await res.json();

      return { data, client, accessToken, uid };
    },

    onSuccess: ({ data }) => {
      setUser({
        id: data.user.id,
        username: data.user.username,
      });
      setToken(data.token);
      router.navigate({ to: '/' });
    },
  });

  let handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <div className='min-h-screen bg-c-background flex items-center justify-center px-4'>
      <div className='bg-c-surface border border-border rounded-2xl shadow-md p-8 w-full max-w-md'>
        <h2 className='text-xl font-semibold text-c-text mb-4'>Log In</h2>

        {mutation.isError && (
          <p className='text-red-600 mb-4'>Login failed. Please try again.</p>
        )}

        <form onSubmit={handleSubmit} className='flex flex-col gap-4 mt-2'>
          <div>
            <label
              htmlFor='email'
              className='block text-sm font-medium text-c-text mb-1'
            >
              Email
            </label>
            <input
              type='email'
              id='email'
              name='email'
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              required
              className='w-full px-3 py-2 border border-c-border rounded-lg bg-white text-sm text-c-text focus:outline-none focus:ring-2 focus:ring-c-accent/40 focus:border-c-accent'
            />
          </div>

          <PasswordInput
            id='password'
            name='password'
            value={formData.password}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, password: e.target.value }))
            }
            required
          />
          <button
            type='submit'
            className='btn border-none mt-2 self-end bg-c-accent hover:bg-c-accent-hover text-white font-semibold px-4 py-2 rounded-lg transition duration-200'
          >
            Log In
          </button>
        </form>

        <p className='mt-6 text-sm text-c-text'>
          Don't have an account?{' '}
          <Link
            to='/auth/signup'
            className='text-c-accent hover:underline font-medium'
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
