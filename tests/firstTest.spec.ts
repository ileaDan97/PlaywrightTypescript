import {test, expect} from '@playwright/test';

test.beforeEach(async({page})=>{
  await page.goto('/');
  await page.getByText('Forms').click();
  await page.getByText('Form Layouts').click();
})

test('firstTest', async ({page}) => {
   await page.getByText('Form Layouts').click();
});

test('locator syntax rules', async ({page}) => {
  //find by Tag name
  page.locator('input')

  //by id
   page.locator('#inputEmail1')

  //by Class value
  page.locator('.shape-rectangle')

  //by attribute
  page.locator('[placeholder="Email"]')

  //combine different selectors
  page.locator('input[placeholder="Email"]')

  //by partial text
  page.locator(':text("Using")')

})

test('user facing locators', async ({page}) => {
  await page.getByText('Form Layouts').click();
  await page.getByRole('textbox', {name: "Email"}).first().click();
  await page.getByRole('button', {name: "Sign in"}).first().click();
  await page.getByLabel("Email").first().click()
  await page.getByPlaceholder('Jane Doe').first().click();
  await page.getByText('Using the grid').click();
  await page.getByTitle('IoT Dashboard').click();
})

test('child elements', async ({page}) => {
  await page.locator('nb-card nb-radio :text("Option 1")').click();
  await page.locator('nb-card').getByRole('button', {name: "Sign in"}).first().click();
  await page.locator('nb-card').nth(3).getByRole('button').click();
})

test('basic form login', async ({page}) => {
  const basicFormEmail = page.locator('#exampleInputEmail1')
  const basicFormPassword = page.locator('#exampleInputPassword1')
  const basicFormSubmitButton = page.locator('nb-card').filter({hasText: "Basic Form"}).getByRole('button')


  await basicFormEmail.fill("test@test.com")
  await basicFormPassword.fill("test123")
  await basicFormSubmitButton.click();
  await expect(basicFormEmail).toHaveValue("test@test.com")
})

test('extracting values', async ({page}) => {
  const basicForm = page.locator('nb-card').filter({hasText: "Basic Form"})
  const buttonText = await basicForm.locator('button').textContent()
  expect(buttonText).toEqual('Submit')

  //all text values
  const allRadioButtonsText = await page.locator('nb-radio').allTextContents()
  expect(allRadioButtonsText).toContain('Option 1')

  //input value
  const emailField = basicForm.getByRole('textbox', {name: 'Email'})
  await emailField.fill("test@test.com")
  const emailValue = await emailField.inputValue()
  expect(emailValue).toEqual('test@test.com')

  const placeholderValue = await emailField.getAttribute('placeholder')
  expect(placeholderValue).toEqual('Email')
})

test('assertions', async ({page}) => {
  //General assertions
  const basicFormButton = page.locator('nb-card').filter({hasText: "Basic Form"}).locator('button')
  const text = await basicFormButton.textContent()
  expect(text).toEqual('Submit')

  //Locator assertions
  await expect(basicFormButton).toHaveText('Submit')

  //Soft assertion
  await expect.soft(basicFormButton).toHaveText('Submit')
  await basicFormButton.click()
})
