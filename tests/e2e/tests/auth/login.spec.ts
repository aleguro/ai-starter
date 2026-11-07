import { expect, test } from '@playwright/test'
import { AuthDriver, uniqueEmail } from '../../drivers/auth'

test.describe('Login / logout', () => {
  async function signUpAndLogOut(auth: AuthDriver, name: string, email: string, password: string) {
    await auth.open()
    await auth.goToSignup()
    await auth.fillSignup(name, email, password)
    await auth.submitSignup()
    await expect(auth.signedInAs(name)).toBeVisible()
    await auth.logout()
  }

  test('TC-03 logging in with valid credentials signs the user in', async ({ page }) => {
    const email = uniqueEmail('login-ok')
    const auth = new AuthDriver(page)
    await signUpAndLogOut(auth, 'Login Ok', email, 'password123')

    await auth.fillLogin(email, 'password123')
    await auth.submitLogin()

    await expect(auth.signedInAs('Login Ok')).toBeVisible()
  })

  test('TC-04 logging in with the wrong password shows an error', async ({ page }) => {
    const email = uniqueEmail('login-bad')
    const auth = new AuthDriver(page)
    await signUpAndLogOut(auth, 'Login Bad', email, 'password123')

    await auth.fillLogin(email, 'wrong-password')
    await auth.submitLogin()

    await expect(auth.errorAlert).toContainText(/invalid email or password/i)
  })

  test('TC-05 logging out clears the session, surviving a reload', async ({ page }) => {
    const email = uniqueEmail('logout')
    const auth = new AuthDriver(page)
    await signUpAndLogOut(auth, 'Logout Test', email, 'password123')

    await page.reload()

    await expect(page.getByRole('button', { name: /^log in$/i })).toBeVisible()
  })
})
