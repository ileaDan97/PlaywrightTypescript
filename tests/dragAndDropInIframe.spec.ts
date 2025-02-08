import {expect} from "@playwright/test";
import {test} from "../test-options"

test('drag and drop', async ({page, globalsQaUrl}) => {
  await page.goto(globalsQaUrl);
  const consentButton = page.locator("button[aria-label='Consent']")
  await consentButton.click()
  const frame = page.frameLocator('[rel-title="Photo Manager"] iframe')
  const trashBox = frame.locator('#trash')
  await frame.locator('li', {hasText: "High Tatras 2"}).dragTo(trashBox)
  await page.waitForTimeout(3000)

  //more precise control
  await frame.locator('li', {hasText: "High Tatras 4"}).hover()
  await page.mouse.down()
  await frame.locator('#trash').hover()
  await page.mouse.up()

  await expect(frame.locator('#trash li h5')).toHaveText(['High Tatras 2', 'High Tatras 4'])
})
