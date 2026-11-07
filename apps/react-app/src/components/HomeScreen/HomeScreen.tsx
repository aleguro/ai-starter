import { useMutation } from '@tanstack/react-query'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useState } from 'react'
import { LoginForm } from '../../features/auth/LoginForm'
import { SignupForm } from '../../features/auth/SignupForm'
import { logout } from '../../features/auth/authApi'
import { useAuthStore } from '../../features/auth/authStore'

function SignedOutView() {
  const [mode, setMode] = useState<'login' | 'signup'>('login')

  return (
    <Stack spacing={2} sx={{ maxWidth: 360 }}>
      {mode === 'login' ? <LoginForm /> : <SignupForm />}
      <Button
        size="small"
        onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
      >
        {mode === 'login' ? 'Create an account' : 'Already have an account? Log in'}
      </Button>
    </Stack>
  )
}

function SignedInView() {
  const user = useAuthStore((state) => state.user)
  const clear = useAuthStore((state) => state.clear)

  const mutation = useMutation({
    mutationFn: logout,
    onSuccess: clear,
    onError: clear,
  })

  return (
    <Stack spacing={2}>
      <Typography>Signed in as {user?.name}</Typography>
      <Button variant="outlined" onClick={() => mutation.mutate()} disabled={mutation.isPending}>
        Log out
      </Button>
    </Stack>
  )
}

export function HomeScreen() {
  const isAuthenticated = useAuthStore((state) => state.token !== null)

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
        App Scaffold
      </Typography>
      {isAuthenticated ? <SignedInView /> : <SignedOutView />}
    </Box>
  )
}
