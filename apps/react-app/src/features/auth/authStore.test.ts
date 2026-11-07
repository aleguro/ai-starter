import { beforeEach, describe, expect, it } from 'vitest'
import { useAuthStore } from './authStore'

describe('authStore', () => {
  beforeEach(() => {
    useAuthStore.getState().clear()
  })

  it('starts signed out', () => {
    expect(useAuthStore.getState().token).toBeNull()
    expect(useAuthStore.getState().user).toBeNull()
  })

  it('stores the token and user on setAuth', () => {
    useAuthStore.getState().setAuth('Bearer abc123', { id: 1, email: 'a@example.com', name: 'A' })

    expect(useAuthStore.getState().token).toBe('Bearer abc123')
    expect(useAuthStore.getState().user?.email).toBe('a@example.com')
  })

  it('clears the token and user on clear', () => {
    useAuthStore.getState().setAuth('Bearer abc123', { id: 1, email: 'a@example.com', name: 'A' })
    useAuthStore.getState().clear()

    expect(useAuthStore.getState().token).toBeNull()
    expect(useAuthStore.getState().user).toBeNull()
  })
})
