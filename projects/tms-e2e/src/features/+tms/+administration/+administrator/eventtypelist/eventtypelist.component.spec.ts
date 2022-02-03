import { test, expect } from '@playwright/test';
import { HelperRoutines } from '../../../../../helperRoutines';

class EventType {

  public eventTypeId: number;
  public description: string;
  public abbreviation: string;
  public status: number; // 0 === false, 1 === true
  public taiexPublish: number; // 0 === false, 1 === true
  public edbPublish: number; // 0 === false, 1 === true
  public agendaRequired: number; // 0 === false, 1 === true
  public active: number; // 0 === false, 1 === true
  public budgetTeam: string;
  public eventCategory: string;
  public userId: string;
  public eventCategoryId: number;
  public budgetTeamId: number;
  public evaluationRequired: number; // 0 === false, 1 === true

  constructor(eventTypeId?: number, description?: string, abbreviation?: string, status?: number, taiexPublish?: number, edbPublish?: number,
              agendaRequired?: number, active?: number, budgetTeam?: string, eventCategory?: string, userId?: string, eventCategoryId?: number,
              budgetTeamId?: number, evaluationRequired?: number) {
    this.eventTypeId = (eventTypeId) ? eventTypeId : 44;
    this.description = (description) ? description : '';
    this.abbreviation = (abbreviation) ? abbreviation : '';
    this.budgetTeam = (budgetTeam) ? budgetTeam : '';
    this.eventCategory = (eventCategory) ? eventCategory : '';
    this.active = (active) ? active : 1;
    this.status = (status) ? status : 1;
    this.agendaRequired = (agendaRequired) ? agendaRequired : 1;
    this.edbPublish = (edbPublish) ? edbPublish : 0;
    this.taiexPublish = (taiexPublish) ? taiexPublish : 0;
    this.evaluationRequired = (evaluationRequired) ? evaluationRequired : 1;
    this.budgetTeamId = (budgetTeamId) ? budgetTeamId : 2;
    this.eventCategoryId = (budgetTeamId) ? budgetTeamId : 3;
  }
}

test.use({
  acceptDownloads: true
});

test('Event type list', async ({ page, baseURL }) => {

  // Go to /#/tms/other/administration/administrator/project/list
  await page.goto(baseURL + '/#/tms/other/administration/administrator/eventtype/list');

  // Click refresh button response
  const [responseList] = await Promise.all([
    page.waitForResponse(res =>
      res.status() === 200 && res.url().includes('/Twinning/api/TMS/admin/eventType-list')
    ),
    page.click('[aria-label="Filter toolbar"] button')
  ]);
  // retrieved json object
  const data = await responseList.json();
  expect(data).toBeTruthy();
  // shallow compare of the retrieved elements data structure
  for (const item of data) {
    expect(HelperRoutines.shallowEqual(item, new EventType())).toBeTruthy();
  }

  // Select item and edit button should be enabled
  await page.click('xpath=//div[normalize-space()=\'44\']');
  await expect(page.locator('xpath=//button[@title=\'Search\']')).toBeEnabled();

  // Select Project header cell to change the order, check if so and check if clear button reset the filter
  await page.click('xpath=//body//app-root//div[@role=\'presentation\']//div[@role=\'presentation\']//div[2]//div[3]//div[1]');
  await expect(page.locator('xpath=//span[@class=\'ag-header-icon ag-header-label-icon ag-sort-ascending-icon\']')).toBeVisible();
  await page.click('xpath=//button[@title=\'Clear\']');
  await expect(page.locator('xpath=//span[@class=\'ag-header-icon ag-header-label-icon ag-sort-ascending-icon\']')).toBeHidden();

  // download xlsx extraction
  const [download] = await Promise.all([
    page.waitForEvent('download'), // wait for download to start,
    page.click('xpath=//button[@title=\'Extract list\']')
  ]);
  // wait for download to complete
  const path = await download.path();
  await expect(path !== '').toBeTruthy();

  // check if the Poject menu and event type menu is available
  await expect(page.locator('xpath=//body//app-root//nav[@id=\'top-menu\']')).toBeVisible();
  await page.hover('text=Other');
  await page.hover('text=Administration');
  await page.hover('text=Projects');
  await page.click('text=Projects');

  // check if the Event Type menu and event type menu is available
  await expect(page.locator('xpath=//body//app-root//nav[@id=\'top-menu\']')).toBeVisible();
  await page.hover('text=Other');
  await page.hover('text=Administration');
  await page.hover('text=Event Type');
  await page.click('text=Event Type');
});
