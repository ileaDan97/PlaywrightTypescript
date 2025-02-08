import {Page} from "@playwright/test";
import {NavigationPage} from "./navigationPage";
import {FormLayoutsPage} from "./formLayoutsPage";
import {DatePickerPage} from "./datePickerPage";

export class PageManager {
  readonly page: Page
  private readonly navigationPage: NavigationPage
  private readonly formsLayoutPage: FormLayoutsPage
  private readonly datePickerPage: DatePickerPage

  constructor(page: Page) {
    this.page = page
    this.navigationPage = new NavigationPage(this.page)
    this.formsLayoutPage = new FormLayoutsPage(this.page)
    this.datePickerPage = new DatePickerPage(this.page)
  }

  navigateToPage() {
    return this.navigationPage
  }

  onFormLayoutPage() {
    return this.formsLayoutPage
  }

  onDatePickerPage(){
    return this.datePickerPage
  }
}
