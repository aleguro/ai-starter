import { apiFetch } from '../../lib/apiClient'
import type { AuthUser } from './authStore'

export interface AuthResult {
  token: string
  user: AuthUser
}

export interface SignupPayload {
  name: string
  email: string
  password: string
}

export interface LoginPayload {
  email: string
  password: string
}

async function authResult(response: Response): Promise<AuthResult> {
  const user = (await response.json()) as AuthUser
  const token = response.headers.get('Authorization') ?? ''
  return { token, user }
}

export async function signup(payload: SignupPayload): Promise<AuthResult> {
  const response = await apiFetch('/signup', {
    method: 'POST',
    body: JSON.stringify({ user: payload }),
  })
  return authResult(response)
}

export async function login(payload: LoginPayload): Promise<AuthResult> {
  const response = await apiFetch('/login', {
    method: 'POST',
    body: JSON.stringify({ user: payload }),
  })
  return authResult(response)
}

export async function logout(): Promise<void> {
  await apiFetch('/logout', { method: 'DELETE' })
}
