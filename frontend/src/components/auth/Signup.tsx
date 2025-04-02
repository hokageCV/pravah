import { useMutation } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { FormEvent, useState } from 'react'
import { BASE_URL } from '../../constants'
import { useAuthStore } from './auth.store'

export function Signup() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' })
  const { setUser } = useAuthStore()
  const router = useRouter()

  const mutation = useMutation({
    mutationFn: async (formData: { username: string; email: string; password: string }) => {
      const res = await fetch(`${BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!res.ok) throw new Error('Signup failed')

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
      <h2>Sign Up</h2>
      {mutation.isError && <p className='text-red-600 mb-4'>Signup failed</p>}

      <form onSubmit={handleSubmit}>
        <input
          type='text'
          name='username'
          placeholder='Username'
          value={formData.username}
          onChange={(e) =>
            setFormData((prevFormData) => ({ ...prevFormData, username: e.target.value }))
          }
          required
        />
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

        <button type='submit'>
        signup
        </button>
      </form>
    </div>
  )
}
