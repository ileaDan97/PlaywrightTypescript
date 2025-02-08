import {test} from "@playwright/test";
import {NavigationPage} from "./page-objects/navigationPage";
import {FormLayoutsPage} from "./page-objects/formLayoutsPage";
import {DatePickerPage} from "./page-objects/datePickerPage";
import {PageManager} from "./page-objects/pageManager";
// @ts-ignore
import {faker} from "@faker-js/faker/locale/ar";

test.beforeEach(async ({page}) => {
  await page.goto('/');
})

test('navigate to form page @smoke @regression', async ({page}) => {
  const pm = new PageManager(page)
  await pm.navigateToPage().formLayoutsPage()
  await pm.navigateToPage().datepickerPage()
  await pm.navigateToPage().tooltipPage()
  await pm.navigateToPage().toastrPage()
  await pm.navigateToPage().smartTablePage()
})

test('parametrized methods', async ({page}) => {
  const pm = new PageManager(page)
  const randomFullName = faker.person.fullName()
  const randomEmail = `${randomFullName.replace(' ', '')}-${faker.number.int(1000)}@test.com`
  await pm.navigateToPage().formLayoutsPage()
  await pm.onFormLayoutPage().submitUsingTheGridFormWithCredentialsAndSelectOption(process.env.USERNAME, process.env.PASSWORD, 'Option 1')
  await page.screenshot({path: 'screenshots/FormLayoutsPage.png'})
  const buffer = await page.screenshot({path: 'screenshots/FormLayoutsPage.png'})
  await pm.onFormLayoutPage().submitInlineFormWithNameEmailAndCheckbox(randomEmail, 'qwerty', true)
  // @ts-ignore
  const inlineForm = this.page.locator('nb-card', {hasText: "Inline form"}).screenshot({path: 'screenshots/FormLayoutsPage.png'})
  await page.waitForTimeout(3000)
  await pm.navigateToPage().datepickerPage()
  await pm.onDatePickerPage().selectCommonDatePickerDateFromToday(7)
  await pm.onDatePickerPage().selectDatePickerWithRangeFromToday(7, 14)
})
