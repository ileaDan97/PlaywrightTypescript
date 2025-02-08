import {Locator, Page} from "@playwright/test";
import {HelperBase} from "./helperBase";

export class NavigationPage extends HelperBase {

  constructor(page: Page) {
    super(page);
  }

  async formLayoutsPage(): Promise<void> {
    await this.selectGroupMenuItem('Forms')
    await this.waitForNumberOfSeconds(2)
    await this.page.getByText('Form Layouts').click();
  }

  async datepickerPage(): Promise<void> {
    await this.selectGroupMenuItem('Forms')
    await this. page.getByText('Datepicker').click();
  }

  async smartTablePage(): Promise<void> {
    await this.selectGroupMenuItem('Tables & Data')
    await this.page.getByText('Smart Table').click();
  }

  async toastrPage(): Promise<void> {
    await this.selectGroupMenuItem('Modal & Overlays')
    await this.page.locator('a[title="Toastr"]').click()
  }

  async tooltipPage(): Promise<void> {
    await this.selectGroupMenuItem('Modal & Overlays')
    await this.page.getByText('Tooltip').click();
  }

  private async selectGroupMenuItem(groupItemTitle: string): Promise<void> {
    const groupMenuItem = this.page.getByTitle(groupItemTitle);
    const expendedState = await groupMenuItem.getAttribute('aria-expanded');
    if (expendedState === "false") {
      await groupMenuItem.click();
    }
  }
}
