import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useAuthStore } from '../../features/auth/authStore'
import { HomeScreen } from './HomeScreen'

function renderWithQuery() {
  const queryClient = new QueryClient()
  return render(
    <QueryClientProvider client={queryClient}>
      <HomeScreen />
    </QueryClientProvider>,
  )
}

describe('HomeScreen', () => {
  beforeEach(() => {
    useAuthStore.getState().clear()
    vi.stubGlobal('fetch', vi.fn())
  })

  it('renders the placeholder heading', () => {
    renderWithQuery()

    expect(screen.getByRole('heading', { name: /app scaffold/i })).toBeInTheDocument()
  })

  it('shows the login form when signed out, with a link to sign up instead', () => {
    renderWithQuery()

    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /sign up/i })).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /create an account/i }))

    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument()
  })

  it('shows the signed-in view with a logout button once authenticated', async () => {
    useAuthStore.getState().setAuth('Bearer abc123', { id: 1, email: 'a@example.com', name: 'Ale' })

    renderWithQuery()

    expect(screen.getByText(/ale/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /log out/i })).toBeInTheDocument()
  })

  it('clears the auth store on logout', async () => {
    useAuthStore.getState().setAuth('Bearer abc123', { id: 1, email: 'a@example.com', name: 'Ale' })
    vi.mocked(fetch).mockResolvedValue(new Response(null, { status: 204 }))

    renderWithQuery()
    fireEvent.click(screen.getByRole('button', { name: /log out/i }))

    await waitFor(() => expect(useAuthStore.getState().token).toBeNull())
  })
})
