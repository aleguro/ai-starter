import { useMutation } from '@tanstack/react-query'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import { useState } from 'react'
import { ApiError } from '../../lib/apiClient'
import { signup } from './authApi'
import { useAuthStore } from './authStore'

export function SignupForm() {
  const setAuth = useAuthStore((state) => state.setAuth)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const mutation = useMutation({
    mutationFn: signup,
    onSuccess: (result) => setAuth(result.token, result.user),
  })

  return (
    <Box
      component="form"
      onSubmit={(event) => {
        event.preventDefault()
        mutation.mutate({ name, email, password })
      }}
    >
      <Stack spacing={2} sx={{ maxWidth: 360 }}>
        {mutation.isError && (
          <Alert severity="error">
            {mutation.error instanceof ApiError ? mutation.error.errors.join(', ') : 'Signup failed'}
          </Alert>
        )}
        <TextField
          label="Name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
        <Button type="submit" variant="contained" disabled={mutation.isPending}>
          Sign up
        </Button>
      </Stack>
    </Box>
  )
}
