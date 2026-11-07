import type { Page } from '@playwright/test'

export function uniqueEmail(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1e6)}@example.com`
}

export class AuthDriver {
  constructor(private readonly page: Page) {}

  async open() {
    await this.page.goto('/')
  }

  async goToSignup() {
    await this.page.getByRole('button', { name: /create an account/i }).click()
  }

  async goToLogin() {
    await this.page.getByRole('button', { name: /already have an account/i }).click()
  }

  async fillSignup(name: string, email: string, password: string) {
    await this.page.getByLabel('Name').fill(name)
    await this.page.getByLabel('Email').fill(email)
    await this.page.getByLabel('Password').fill(password)
  }

  async submitSignup() {
    await this.page.getByRole('button', { name: /^sign up$/i }).click()
  }

  async fillLogin(email: string, password: string) {
    await this.page.getByLabel('Email').fill(email)
    await this.page.getByLabel('Password').fill(password)
  }

  async submitLogin() {
    await this.page.getByRole('button', { name: /^log in$/i }).click()
  }

  async logout() {
    await this.page.getByRole('button', { name: /log out/i }).click()
  }

  signedInAs(name: string) {
    return this.page.getByText(new RegExp(`signed in as ${name}`, 'i'))
  }

  get errorAlert() {
    return this.page.getByRole('alert')
  }
}
