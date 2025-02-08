import {expect, test} from "@playwright/test";

test.beforeEach(async ({page}) => {
  await page.goto('/');
})

test.describe('Form Layouts page', () => {
  test.beforeEach(async ({page}) => {
    await page.getByText('Forms').click();
    await page.getByText('Form Layouts').click();
  })

  test('input field', async ({page}) => {
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

  test.only('radio buttons', async ({page}) => {
    const radioButton1 = page.locator('nb-card', {hasText: "Using the Grid"})
    //await radioButton1.getByLabel('Option 1').check({force: true});
    const radioOption1 = await radioButton1.getByRole('radio', {name: "Option 2"}).check({force: true});
    const radioStatus = await radioButton1.getByRole('radio', {name: "Option 1"}).isChecked()
    await expect(radioButton1).toHaveScreenshot({maxDiffPixels: 250})
    // expect(radioStatus).toBeTruthy()
    // await expect(radioButton1.getByRole('radio', {name: "Option 1"})).toBeChecked()

    // const radioButton2 = page.locator('nb-card', {hasText: "Using the Grid"})
    // await radioButton2.getByRole('radio', {name: "Option 2"}).check({force: true});
    // expect(radioOption1).toBeFalsy()
    // expect(radioButton2.getByRole('radio', {name: "Option 2"}).check({force: true})).toBeTruthy()
  })
})

test('checkbox buttons', async ({page}) => {
  await page.getByTitle('Modal & Overlays').click();
  await page.locator('a[title="Toastr"]').click();
  // await page.getByText('Hide on click').uncheck()
  // await page.getByRole('checkbox', {name: 'Prevent arising of duplicate toast'}).check({force: true});

  // const preventCheckBox = page.getByText('Prevent arising of duplicate toast')
  // if (await preventCheckBox.isChecked()){
  //    console.log('checkbox is checked')
  // }else {
  //   await preventCheckBox.click({force: true});
  // }

  const allCheckBoxes = page.getByRole('checkbox')
  for (const checkbox of await allCheckBoxes.all()) {
    await checkbox.uncheck({force: true});
    expect(await checkbox.isChecked()).toBeFalsy()
  }
})

test('List and Dropdowns', async ({page}) => {
  const dropdownButton = page.locator('ngx-header nb-select')
  await dropdownButton.click();

  page.getByRole('list')// When the list has a UL tag
  page.getByRole('listitem') // When the list has LI tag

  //const optionList = page.getByRole('list').locator('nb-option');
  const optionList = page.locator('nb-option-list nb-option')
  //await expect(optionList).toHaveText(["Light", "Dark", "Cosmic", "Corporate"]);
  await optionList.filter({hasText: "Cosmic"}).click();
  const header = page.locator('nb-layout-header');
  await expect(header).toHaveCSS('background-color', 'rgb(50, 50, 89)');

  const colors = {
    "Light": "rgb(255, 255, 255)",
    "Dark": "rgb(34, 43, 69)",
    "Cosmic": "rgb(50, 50, 89)",
    "Corporate": "rgb(255, 255, 255)"
  }

  await dropdownButton.click();
  for (const color in colors) {
    await optionList.filter({hasText: color}).click();
    await expect(header).toHaveCSS('background-color', colors[color]);
    if (color != "Corporate") {
      await dropdownButton.click();
    }
  }
})

test('hovering over tooltip', async ({page}) => {
  await page.getByText('Modal & Overlays').click();
  await page.getByText('Tooltip').click();
  const toolTipCard = page.locator('nb-card', {hasText: "Tooltip Placements"})
  await toolTipCard.getByRole('button', {name: 'Top'}).hover();
  page.getByRole('tooltip') //works if you have a role tooltip created
  const tooltip = await page.locator('nb-tooltip').textContent()
  expect(tooltip).toContain('This is a tooltip');
  await page.waitForTimeout(5000)
})

test('accepting the browser dialog', async ({page}) => {
  await page.getByText('Tables & Data').click();
  await page.getByText('Smart Table').click();

//page listener
  page.on('dialog', dialog => {
    expect(dialog.message()).toContain('Are you sure you want to delete?')
    dialog.accept()
  })

  await page.getByRole('table').locator('tr', {hasText: "mdo@gmail.com"}).locator('.nb-trash').click();
  await expect(page.locator('table tr').first()).not.toHaveText('mdo@gmail.com');
  // await page.locator('.nb-trash').first().click();
  await page.waitForTimeout(5000)
})

test('web tables', async ({page}) => {
  await page.getByText('Tables & Data').click();
  await page.getByText('Smart Table').click();

  //how to get the row by any text in the row
  const targetRow = page.getByRole('row', {name: 'twitter@outlook.com'})
  await targetRow.locator('.nb-edit').click();
  await page.locator('input-editor').getByPlaceholder('Age').clear()
  await page.locator('input-editor').getByPlaceholder('Age').fill('35')
  await page.locator('.nb-checkmark').click();

  //get the row based on the value in the specific column
  await page.locator('.ng2-smart-pagination-nav').getByText('2').click();
  const targetRowById = page.getByRole('row', {name: '11'}).filter({has: page.locator('td').nth(1).getByText('11')})
  await targetRowById.locator('.nb-edit').click();
  await page.locator('input-editor').getByPlaceholder('E-mail').clear()
  await page.locator('input-editor').getByPlaceholder('E-mail').fill('test@test.com')
  await page.locator('.nb-checkmark').click();
  await expect(targetRowById.locator('td').nth(5)).toHaveText('test@test.com')

  //test filter of the table
  const ages = ["20", "30", "40", "200"]
  for (let age of ages) {
    await page.locator('input-filter').getByPlaceholder('Age').clear()
    await page.locator('input-filter').getByPlaceholder('Age').fill(age)
    await page.waitForTimeout(500)
    const ageRows = page.locator('tbody tr')
    for (let row of await ageRows.all()) {
      const cellValue = await row.locator('td').last().textContent()
      if (age == "200") {
        expect(await page.getByRole('table').textContent()).toContain('No data found')
      } else {
        expect(cellValue).toContain(age)
      }
    }
  }
})

test('datepicker page', async ({page}) => {
  await page.getByText('Forms').click();
  await page.getByText('Datepicker').click();

  const calendarInputField = page.getByPlaceholder('Form Picker');
  await calendarInputField.click();

  let date = new Date();
  date.setDate(date.getDate() + 7);
  const expectedDate = date.getDate().toString()
  const expectedMonthShort = date.toLocaleString('En-US', {month: 'short'})
  const expectedMonthLong = date.toLocaleString('En-US', {month: 'long'})
  const expectedYear = date.getFullYear()
  const dateToAssert = `${expectedMonthShort} ${expectedDate}, ${expectedYear}`

  let calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()
  const expectedMonthAndYear = `${expectedMonthLong} ${expectedYear}`
  while (!calendarMonthAndYear.includes(expectedMonthAndYear)) {
    await page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click();
    calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()
  }

  await page.waitForTimeout(1000)
  await page.locator('nb-calendar-day-cell[class="day-cell ng-star-inserted"]').getByText(expectedDate, {exact: true}).click();
  await expect(calendarInputField).toHaveValue(dateToAssert)
})

test('sliders', async ({page}) => {
  //Update slider attribute
  // const tempGauge =  page.locator('[tabtitle="Temperature"] ngx-temperature-dragger circle')
  // await tempGauge.evaluate(node => {
  //   node.setAttribute('cx', '232.630')
  //   node.setAttribute('cy', '232.630')
  // })
  // await tempGauge.click()
  // await page.waitForTimeout(5000)

  //Mouse movement
  const tempBox = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger')
  await tempBox.scrollIntoViewIfNeeded()
  await tempBox.boundingBox()
  const box = await tempBox.boundingBox()
  const x = box.x + box.width / 2
  const y = box.y + box.height / 2
  await page.mouse.move(x, y)
  await page.mouse.down()
  await page.mouse.move(x + 100, y)
  await page.mouse.move(x + 100, y + 100)
  await page.mouse.up()
  await expect(tempBox).toContainText('30')
  await page.waitForTimeout(3000)
})

test('drag and drop', async ({page}) => {

})
