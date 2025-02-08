import {test} from "../test-options";
import {NavigationPage} from "./page-objects/navigationPage";
import {FormLayoutsPage} from "./page-objects/formLayoutsPage";
import {DatePickerPage} from "./page-objects/datePickerPage";
import {PageManager} from "./page-objects/pageManager";
// @ts-ignore
import {faker} from "@faker-js/faker";

test('parametrized methods', async ({page}) => {
  const pm = new PageManager(page)
  const randomFullName = faker.person.fullName()
  const randomEmail = `${randomFullName.replace(' ', '')}-${faker.number.int(1000)}@test.com`

  await pm.onFormLayoutPage().submitUsingTheGridFormWithCredentialsAndSelectOption(process.env.USERNAME, process.env.PASSWORD, 'Option 1')
  await pm.onFormLayoutPage().submitInlineFormWithNameEmailAndCheckbox(randomEmail, 'qwerty', true)
})
