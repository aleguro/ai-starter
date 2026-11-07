import { expect, test } from '@playwright/test'
import { AuthDriver, uniqueEmail } from '../../drivers/auth'

test.describe('Signup', () => {
  test('TC-01 signing up creates an account and signs the user in', async ({ page }) => {
    const auth = new AuthDriver(page)
    await auth.open()
    await auth.goToSignup()
    await auth.fillSignup('Ale E2E', uniqueEmail('ale'), 'password123')
    await auth.submitSignup()

    await expect(auth.signedInAs('Ale E2E')).toBeVisible()
  })

  test('TC-02 signing up with a duplicate email shows a validation error', async ({ page }) => {
    const email = uniqueEmail('dup')
    const auth = new AuthDriver(page)

    await auth.open()
    await auth.goToSignup()
    await auth.fillSignup('First', email, 'password123')
    await auth.submitSignup()
    await expect(auth.signedInAs('First')).toBeVisible()
    await auth.logout()

    await auth.goToSignup()
    await auth.fillSignup('Second', email, 'password123')
    await auth.submitSignup()

    await expect(auth.errorAlert).toContainText(/email/i)
  })
})
