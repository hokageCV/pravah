import { useState, type ChangeEvent } from 'react';

type PasswordInputProps = {
  id: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  className?: string;
  label?: string;
};

export function PasswordInput({
  id,
  name,
  value,
  onChange,
  required = false,
  className = '',
  label = 'Password',
}: PasswordInputProps) {
  let [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <label
        htmlFor={id}
        className='block text-sm font-medium text-c-text mb-1'
      >
        {label}
      </label>

      <div className='flex items-center border border-c-border rounded-lg bg-white px-3 py-2 focus-within:ring-2 focus-within:ring-c-accent/40 focus-within:border-c-accent'>
        <input
          type={showPassword ? 'text' : 'password'}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className={`flex-1 text-sm text-c-text focus:outline-none bg-transparent ${className}`}
          aria-describedby={`${id}-toggle`}
        />

        <button
          type='button'
          id={`${id}-toggle`}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          aria-pressed={showPassword}
          onClick={() => setShowPassword((prev) => !prev)}
          className='ml-2 text-c-text hover:text-c-accent focus:outline-none'
        >
          {showPassword ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>
    </div>
  );
}

function EyeIcon() {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      className='h-5 w-5'
      fill='none'
      viewBox='0 0 24 24'
      stroke='currentColor'
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={2}
        d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
      />
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={2}
        d='M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
      />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      className='h-5 w-5'
      fill='none'
      viewBox='0 0 24 24'
      stroke='currentColor'
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={2}
        d='M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.1.177-2.163.5-3.152M9.9 9.9l4.2 4.2M9.9 14.1l4.2-4.2M3 3l18 18'
      />
    </svg>
  );
}
