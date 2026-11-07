import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useAuthStore } from './authStore'
import { SignupForm } from './SignupForm'

function renderWithQuery() {
  const queryClient = new QueryClient()
  return render(
    <QueryClientProvider client={queryClient}>
      <SignupForm />
    </QueryClientProvider>,
  )
}

describe('SignupForm', () => {
  beforeEach(() => {
    useAuthStore.getState().clear()
    vi.stubGlobal('fetch', vi.fn())
  })

  it('submits name/email/password and stores the returned auth on success', async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify({ id: 1, email: 'a@example.com', name: 'A' }), {
        status: 201,
        headers: { Authorization: 'Bearer abc123' },
      }),
    )

    renderWithQuery()

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'A' } })
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'a@example.com' } })
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } })
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }))

    await waitFor(() => expect(useAuthStore.getState().token).toBe('Bearer abc123'))
  })

  it('shows the server validation error on failure', async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify({ errors: ['Email has already been taken'] }), { status: 422 }),
    )

    renderWithQuery()

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'A' } })
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'a@example.com' } })
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } })
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }))

    expect(await screen.findByText(/email has already been taken/i)).toBeInTheDocument()
  })
})
