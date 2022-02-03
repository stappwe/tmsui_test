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

test('Project list', async ({ page, baseURL }) => {

  // Go to /#/tms/other/administration/administrator/project/list
  await page.goto(baseURL + '/#/tms/other/administration/administrator/project/list');

  // Click refresh button response
  const [responseList] = await Promise.all([
    page.waitForResponse(res =>
      res.status() === 200 && res.url().includes('/Twinning/api/TMS/admin/project-list')
    ),
    page.click('[aria-label="Filter toolbar"] button')
  ]);
  // retrieved json object
  const data = await responseList.json();
  expect(data).toBeTruthy();
  // shallow compare of the retrieved elements data structure
  for (const item of data) {
    expect(HelperRoutines.shallowEqual(item, new Project())).toBeTruthy();
  }

  // Select item and edit button should be enabled
  await page.click('xpath=//div[normalize-space()=\'1\']');
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

});
