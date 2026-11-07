import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { App } from './App'

describe('App', () => {
  it('renders the home screen inside the providers', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: /app scaffold/i })).toBeInTheDocument()
  })
})
