import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useAuthStore } from './authStore'
import { LoginForm } from './LoginForm'

function renderWithQuery() {
  const queryClient = new QueryClient()
  return render(
    <QueryClientProvider client={queryClient}>
      <LoginForm />
    </QueryClientProvider>,
  )
}

describe('LoginForm', () => {
  beforeEach(() => {
    useAuthStore.getState().clear()
    vi.stubGlobal('fetch', vi.fn())
  })

  it('submits email/password and stores the returned auth on success', async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify({ id: 1, email: 'a@example.com', name: 'A' }), {
        status: 200,
        headers: { Authorization: 'Bearer abc123' },
      }),
    )

    renderWithQuery()

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'a@example.com' } })
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } })
    fireEvent.click(screen.getByRole('button', { name: /log in/i }))

    await waitFor(() => expect(useAuthStore.getState().token).toBe('Bearer abc123'))
  })

  it('shows an error for invalid credentials', async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify({ errors: ['Invalid email or password'] }), { status: 401 }),
    )

    renderWithQuery()

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'a@example.com' } })
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrong' } })
    fireEvent.click(screen.getByRole('button', { name: /log in/i }))

    expect(await screen.findByText(/invalid email or password/i)).toBeInTheDocument()
  })
})
