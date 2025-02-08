import {expect, test} from "@playwright/test";

test.beforeEach(async ({page}) => {
  await page.goto('/');

})

test('mobileTest', async ({page}, testInfo) => {
  if (testInfo.project.name=='mobileTest'){
    await page.locator('.sidebar-toggle').click()
  }
  await page.getByText('Forms').click();
  await page.getByText('Form Layouts').click();
  await page.locator('.sidebar-toggle').click()
  const inputFieldEmail = page.locator('nb-card', {hasText: "Using the Grid"}).getByRole('textbox', {name: 'Email'});
  await inputFieldEmail.fill("test@test.com");
  await inputFieldEmail.clear()
  await inputFieldEmail.pressSequentially('tes3t@test.com', {delay: 500});

  //generic assertion
  const inputValue = inputFieldEmail.inputValue()
  //expect(inputValue).toEqual("tes3t@test.com");

  //locator assertion
  await expect(inputFieldEmail).toHaveValue("tes3t@test.com");
})
