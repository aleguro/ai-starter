import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ApiError } from '../../lib/apiClient'
import { login, logout, signup } from './authApi'

describe('authApi', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('signup posts to /signup and returns the user + token', async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify({ id: 1, email: 'a@example.com', name: 'A' }), {
        status: 201,
        headers: { Authorization: 'Bearer abc123' },
      }),
    )

    const result = await signup({ name: 'A', email: 'a@example.com', password: 'password123' })

    expect(result.token).toBe('Bearer abc123')
    expect(result.user.email).toBe('a@example.com')
    const [url, options] = vi.mocked(fetch).mock.calls[0]
    expect(url).toContain('/signup')
    expect(options?.method).toBe('POST')
  })

  it('login posts to /login and returns the user + token', async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify({ id: 1, email: 'a@example.com', name: 'A' }), {
        status: 200,
        headers: { Authorization: 'Bearer abc123' },
      }),
    )

    const result = await login({ email: 'a@example.com', password: 'password123' })

    expect(result.token).toBe('Bearer abc123')
  })

  it('login raises an ApiError on invalid credentials', async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify({ errors: ['Invalid email or password'] }), { status: 401 }),
    )

    await expect(login({ email: 'a@example.com', password: 'wrong' })).rejects.toBeInstanceOf(ApiError)
  })

  it('logout sends a DELETE to /logout', async () => {
    vi.mocked(fetch).mockResolvedValue(new Response(null, { status: 204 }))

    await logout()

    const [url, options] = vi.mocked(fetch).mock.calls[0]
    expect(url).toContain('/logout')
    expect(options?.method).toBe('DELETE')
  })
})
