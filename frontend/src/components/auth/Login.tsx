import { useMutation } from '@tanstack/react-query'
import { Link, useRouter } from '@tanstack/react-router'
import { FormEvent, useState } from 'react'
import { BASE_URL } from '../../constants'
import { useAuthStore } from './auth.store'

export function Login() {
  let [formData, setFormData] = useState({ username: '', email: '', password: '' })
  let setUser = useAuthStore((state) => state.setUser)
  let setToken = useAuthStore((state) => state.setToken)

  let router = useRouter()

  let mutation = useMutation({
    mutationFn: async (formData: { email: string; password: string }) => {
      let res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!res.ok) throw new Error('Login failed')

      let headers = res.headers
      let client = headers.get('client') || ''
      let accessToken = headers.get('access-token') || ''
      let uid = headers.get('uid') || ''
      let data = await res.json()

      return { data, client, accessToken, uid }
    },

    onSuccess: ({ data }) => {
      setUser({
        id: data.user.id,
        username: data.user.username,
      })
      setToken(data.token)
      router.navigate({ to: '/' })
    },
  })

  let handleSubmit = async (e: FormEvent) => {
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
