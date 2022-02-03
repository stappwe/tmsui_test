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

test('Event type detail', async ({ page, baseURL }) => {

  // Click refresh button response
  const [load] = await Promise.all([
    page.waitForResponse(res =>
      res.status() === 200 && res.url().includes('/Twinning/api/TMS/admin/eventType-detail/44')
    ),
    page.goto(baseURL + '/#/tms/other/administration/administrator/eventtype/44')
  ]);
  // retrieved json object
  const loadData = await load.json();
  expect(loadData).toBeTruthy();
  // Expect eventTypeId = 44
  const eventTypeId = await page.inputValue('xpath=//input[@type=\'number\']');
  await expect(eventTypeId === '44').toBeTruthy();

  // Back and save enabled
  await expect(page.locator('xpath=//button[normalize-space()=\'Back\']')).toBeEnabled();
  await expect(page.locator('xpath=//button[normalize-space()=\'Save\']')).toBeEnabled();

  // Modify value
  const project = await page.inputValue('xpath=//input[@formcontrolname=\'description\']');
  await page.fill('xpath=//input[@formcontrolname=\'description\']', 'Inst.. new');
  // Cancel visible
  await expect(page.locator('xpath=//button[normalize-space()=\'Cancel\']')).toBeVisible();
  await expect(page.locator('xpath=//button[normalize-space()=\'Cancel\']')).toBeEnabled();
  // Save working
  const [save] = await Promise.all([
    page.waitForResponse(res =>
      res.status() === 201 && res.url().includes('/Twinning/api/TMS/admin/eventType-set')
    ),
    page.click('xpath=//button[normalize-space()=\'Save\']')
  ]);
  // retrieved json object
  const saveData = await save.json();
  expect(saveData).toBeTruthy();

  // Modify value back to original
  await page.fill('xpath=//input[@formcontrolname=\'description\']', project);
  // Save working
  const [saveOriginal] = await Promise.all([
    page.waitForResponse(res =>
      res.status() === 201 && res.url().includes('/Twinning/api/TMS/admin/eventType-set')
    ),
    page.click('xpath=//button[normalize-space()=\'Save\']')
  ]);
  // retrieved json object
  const saveOriginalData = await saveOriginal.json();
  expect(saveOriginalData).toBeTruthy();
});
