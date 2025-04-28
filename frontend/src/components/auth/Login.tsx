import { useMutation } from '@tanstack/react-query'
import { Link, useRouter } from '@tanstack/react-router'
import { FormEvent, useState } from 'react'
import { BASE_URL } from '../../constants'
import { useAuthStore } from './auth.store'

export function Login() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' })
  const { setUser } = useAuthStore()
  const router = useRouter()

  const mutation = useMutation({
    mutationFn: async (formData: { email: string; password: string }) => {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!res.ok) throw new Error('Login failed')

      const headers = res.headers
      const client = headers.get('client') || ''
      const accessToken = headers.get('access-token') || ''
      const uid = headers.get('uid') || ''
      const data = await res.json()

      return { data, client, accessToken, uid }
    },
    onSuccess: ({ data }) => {
      setUser({
        id: data.user.id,
        username: data.user.username,
      })
      router.navigate({ to: '/' })
    },
  })
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    mutation.mutate(formData)
  }

  return (
    <div>
      <h2>Log In</h2>
      {mutation.isError && <p className='text-red-600 mb-4'>Login failed</p>}

      <form onSubmit={handleSubmit}>
        <input
          type='email'
          name='email'
          placeholder='Email'
          value={formData.email}
          onChange={(e) =>
            setFormData((prevFormData) => ({ ...prevFormData, email: e.target.value }))
          }
          required
        />
        <input
          type='password'
          name='password'
          placeholder='Password'
          value={formData.password}
          onChange={(e) =>
            setFormData((prevFormData) => ({ ...prevFormData, password: e.target.value }))
          }
          required
        />

        <button type='submit'>login</button>
      </form>
      <p className='mt-4'>
        Don't have an account?
        <Link to='/auth/signup' className='underline'>
          Sign up
        </Link>
      </p>
    </div>
  )
}
