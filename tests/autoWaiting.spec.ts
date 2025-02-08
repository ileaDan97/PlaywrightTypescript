import {test, expect} from '@playwright/test';

test.beforeEach(async({page}, testInfo)=>{
  await page.goto(process.env.URL);
  await page.locator('#ajaxButton').click();
  testInfo.setTimeout(testInfo.timeout + 2000);
})

test('auto waiting', async({page}) => {
  const successButton =  page.locator('.bg-success')
  //await successButton.click();

  //const text = await successButton.textContent()
  // await successButton.waitFor({state: "visible"})
  // const textAll = await successButton.allTextContents()
  // expect(textAll).toContain('Data loaded with AJAX get request.')

  await expect(successButton).toHaveText('Data loaded with AJAX get request.', {timeout: 17000})
})

test.skip('alternative waiting', async({page}) => {
  const successButton =  page.locator('.bg-success')

  //wait for element
  await page.waitForSelector('.bg-success')

  const textAll = await successButton.allTextContents()
  expect(textAll).toContain('Data loaded with AJAX get request.')

  //wait for particular response
  //await page.waitForResponse('http://uitestingplayground.com/ajax')

  //wait for network calls to be completed(not recommended)
  await page.waitForLoadState('networkidle')
})

test.skip('timeouts', async({page}) => {
  // test.setTimeout(10000)
  test.slow() //will multiply the timeout by 3
  const successButton =  page.locator('.bg-success')
  await successButton.click();

})
