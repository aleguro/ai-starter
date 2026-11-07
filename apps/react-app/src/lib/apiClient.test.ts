import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useAuthStore } from '../features/auth/authStore'
import { apiFetch } from './apiClient'

describe('apiFetch', () => {
  beforeEach(() => {
    useAuthStore.getState().clear()
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('calls the API base URL with no Authorization header when signed out', async () => {
    vi.mocked(fetch).mockResolvedValue(new Response('{}', { status: 200 }))

    await apiFetch('/health')

    const [, options] = vi.mocked(fetch).mock.calls[0]
    expect(options?.headers).not.toHaveProperty('Authorization')
  })

  it('attaches the stored token as an Authorization header when signed in', async () => {
    useAuthStore.getState().setAuth('Bearer abc123', { id: 1, email: 'a@example.com', name: 'A' })
    vi.mocked(fetch).mockResolvedValue(new Response('{}', { status: 200 }))

    await apiFetch('/me')

    const [, options] = vi.mocked(fetch).mock.calls[0]
    const headers = options?.headers as Record<string, string> | undefined
    expect(headers?.Authorization).toBe('Bearer abc123')
  })
})
