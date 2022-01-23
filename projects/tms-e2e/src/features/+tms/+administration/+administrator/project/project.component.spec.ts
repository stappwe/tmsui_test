import { test, expect } from '@playwright/test';
import { HelperRoutines } from '../../../../../helperRoutines';

class Project {
  public projectId: number;
  public abbreviation: string;
  public consultation: number; // 0 === false, 1 === true
  public description: string;
  public comment: string;
  public generalEmail: string;
  public signatureEmail: string;
  public signatureEmailOutlook: string;
  public emailRequestValidator: string;

  constructor(projectId?: number, abbreviation?: string, consultation?: number, description?: string, comment?: string,
              generalEmail?: string, signatureEmail?: string, signatureEmailOutlook?: string, emailRequestValidator?: string) {
    this.projectId = (projectId) ? projectId : -1;
    this.abbreviation = (abbreviation) ? abbreviation : '';
    this.consultation = (consultation) ? consultation : 0;
    this.description = (description) ? description : '';
    this.comment = (comment) ? comment : '';
    this.generalEmail = (generalEmail) ? generalEmail : '';
    this.signatureEmail = (signatureEmail) ? signatureEmail : '';
    this.signatureEmailOutlook = (signatureEmailOutlook) ? signatureEmailOutlook : '';
    this.emailRequestValidator = (emailRequestValidator) ? emailRequestValidator : '';
  }
}

test.use({
  acceptDownloads: true
});

test('Project detail', async ({ page, baseURL }) => {

  // Click refresh button response
  const [load] = await Promise.all([
    page.waitForResponse(res =>
      res.status() === 200 && res.url().includes('/Twinning/api/TMS/admin/project-detail/1')
    ),
    page.goto(baseURL + '/#/tms/other/administration/administrator/project/1')
  ]);
  // retrieved json object
  const loadData = await load.json();
  expect(loadData).toBeTruthy();
  // Expect projectId = 1
  const projectId = await page.inputValue('xpath=//input[@type=\'number\']');
  await expect(projectId === '1').toBeTruthy();

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
      res.status() === 201 && res.url().includes('/Twinning/api/TMS/admin/project-set')
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
      res.status() === 201 && res.url().includes('/Twinning/api/TMS/admin/project-set/')
    ),
    page.click('xpath=//button[normalize-space()=\'Save\']')
  ]);
  // retrieved json object
  const saveOriginalData = await saveOriginal.json();
  expect(saveOriginalData).toBeTruthy();
});
