import { Link, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

export function PathNotFound() {
  let navigate = useNavigate();
  let [countdown, setCountdown] = useState(5);

  useEffect(() => {
    let interval = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    let timer = setTimeout(() => navigate({ to: '/' }), 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [navigate]);

  return (
    <div className='flex flex-col items-center justify-center  gap-4 mt-8'>
      <h1 className='text-2xl font-bold'>Page Not Found</h1>

      <div className='text-center'>
        <p>You'll be automatically redirected in...</p>
        <div className='text-4xl font-mono my-4 animate-pulse'>{countdown}</div>
      </div>

      <div className='flex gap-4'>
        <Link
          to='/'
          className='px-4 py-2 bg-c-accent text-white rounded hover:bg-blue-600 transition'
        >
          Go Home Now
        </Link>
      </div>
    </div>
  );
}
