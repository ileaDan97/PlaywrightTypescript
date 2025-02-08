import {test as base} from '@playwright/test'
import {as} from "@faker-js/faker/dist/airline-D6ksJFwG";
import {tr} from "@faker-js/faker";
import {PageManager} from "./tests/page-objects/pageManager";

export type TestOptions ={
  globalsQaUrl: string
  formLayoutsPage: string
  pageManager: PageManager
}

export const test = base.extend<TestOptions>({
  globalsQaUrl: ['', {option: true}],
  formLayoutsPage: [async({page}, use) => {
    await page.goto('/')
    await page.getByText('Forms').click()
    await page.getByText('Forms Layouts').click()
    await use('')
  }, {
    auto:true
  }],
  pageManager: async({page, formLayoutsPage }, use) => {
    const pm = new PageManager(page)
    await use(pm)
  }
})
