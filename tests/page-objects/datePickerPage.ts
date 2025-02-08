import {expect, Page} from "@playwright/test";

export class DatePickerPage {
  readonly page: Page

  constructor(page: Page) {
    this.page = page;
  }

  async selectCommonDatePickerDateFromToday(numberOfDaysFromToday: number): Promise<void> {
    const calendarInputField = this.page.getByPlaceholder('Form Picker');
    await calendarInputField.click();
    const dateToAssert = await this.selectDayInTheCalendar(numberOfDaysFromToday);
    await expect(calendarInputField).toHaveValue(dateToAssert)
  }

  async selectDatePickerWithRangeFromToday(startDate: number, endDate: number): Promise<void> {
    const calendarInputField = this.page.getByPlaceholder('Range Picker');
    await calendarInputField.click();

    const dateToAssertStart = await this.selectDayInTheCalendar(startDate);
    const dateToAssertEnd = await this.selectDayInTheCalendar(endDate);
    const dateToAssert = `${dateToAssertStart} - ${dateToAssertEnd}`;
    await expect(calendarInputField).toHaveValue(dateToAssert)
  }

  private async selectDayInTheCalendar(numberOfDaysFromToday: number): Promise<string> {
    let date = new Date();
    date.setDate(date.getDate() + numberOfDaysFromToday);
    const expectedDate = date.getDate().toString()
    const expectedMonthShort = date.toLocaleString('En-US', {month: 'short'})
    const expectedMonthLong = date.toLocaleString('En-US', {month: 'long'})
    const expectedYear = date.getFullYear()
    const dateToAssert = `${expectedMonthShort} ${expectedDate}, ${expectedYear}`

    let calendarMonthAndYear = await this.page.locator('nb-calendar-view-mode').textContent()
    const expectedMonthAndYear = `${expectedMonthLong} ${expectedYear}`
    while (!calendarMonthAndYear.includes(expectedMonthAndYear)) {
      await this.page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click();
      calendarMonthAndYear = await this.page.locator('nb-calendar-view-mode').textContent()
    }

    await this.page.waitForTimeout(1000)
    await this.page.locator('.day-cell.ng-star-inserted').getByText(expectedDate, {exact: true}).click();
    return dateToAssert
  }
}
