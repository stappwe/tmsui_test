import { Body, Controller, Get, Header, Headers, HttpCode, HttpStatus, Param, Post, Res } from '@nestjs/common';

import { Response } from 'express';
import { createReadStream } from 'fs';
import * as path from 'path';

import { AppService } from './app.service';

@Controller()
export class AppController {
  public static userToken: string;

  constructor(private readonly appService: AppService) {
    AppController.userToken = '';
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('Twinning/api/alllanguages')
  getGridFilters(@Headers('authorization') authorization: string, @Res() res: Response) {
    console.log('Twinning/api/alllanguages - Authorization: ' + authorization);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, './resources/json/app/allLanguages.json')).pipe(res);
  }

  @Post('Twinning/api/my-settings/TMS/set-backup-user/:userId/:backupUserId')
  setBackupUserFor(@Headers('authorization') authorization: string,
                @Param('userId') userId: string,
                @Param('backupUserId') backupUserId: string): object {
    console.log('Twinning/api/my-settings/TMS/set-backup-user - Authorization: ' + authorization +
      ', userId: ' + userId + ', backupUserId: ' + backupUserId);
    // Extract payload
    // let jwt = new JWT(authorization);

    return null;
  }

  @Post('Twinning/api/my-settings/TMS/set-backup-user/:backupUserId')
  setBackupUser(@Headers('authorization') authorization: string,
                @Param('backupUserId') backupUserId: string): object {
    console.log('Twinning/api/my-settings/TMS/set-backup-user - Authorization: ' + authorization +
      ', backupUserId: ' + backupUserId);
    // Extract payload
    // let jwt = new JWT(authorization);

    return null;
  }

  @Post('Twinning/api/my-settings/TMS/set-own-backup-user/:backupUserId')
  setOwnBackupUser(@Headers('authorization') authorization: string,
                   @Param('backupUserId') backupUserId: string): object {
    console.log('Twinning/api/my-settings/TMS/set-own-backup-user - Authorization: ' + authorization +
      ', backupUserId: ' + backupUserId);
    // Extract payload
    // let jwt = new JWT(authorization);

    return null;
  }

  @Get('Twinning/api/user/change-active-user-role/TMS/:userRoleId')
  updateActiveUserRole(@Headers('authorization') authorization: string,
                       @Param('userRoleId') userRoleId: string): boolean {
    console.log('Twinning/api/user/change-active-user-role/TMS - Authorization: ' + authorization +
      ', userRoleId: ' + userRoleId);
    // Extract payload
    // let jwt = new JWT(authorization);

    return true;
  }

  @Post('Twinning/api/my-settings/TMS/set-team/:selectedUserId/:teamId')
  setTeam(@Headers('authorization') authorization: string,
          @Param('selectedUserId') selectedUserId: string,
          @Param('teamId') teamId: string): boolean {
    console.log('Twinning/api/my-settings/TMS/set-team - Authorization: ' + authorization +
      ', selectedUserId: ' + selectedUserId + ', teamId: ' + teamId);
    // Extract payload
    // let jwt = new JWT(authorization);

    return true;
  }

  @Get('Twinning/api/my-settings/TMS/all-users-list')
  getAllUsers(@Headers('authorization') authorization: string, @Res() res: Response) {
    console.log('Twinning/api/my-settings/TMS/all-users-list - Authorization: ' + authorization);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, './resources/json/app/allUserList.json')).pipe(res);
  }

  @Get('Twinning/api/my-settings/TMS/team-list')
  getTeamList(@Headers('authorization') authorization: string, @Res() res: Response) {
    console.log('Twinning/api/my-settings/TMS/team-list - Authorization: ' + authorization);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, './resources/json/app/mySettingsBackupTeam.json')).pipe(res);
  }

  @Get('Twinning/api/my-settings/TMS/backup-user-list/:forUserId')
  getBackupUser(@Headers('authorization') authorization: string,
                @Param('forUserId') forUserId: string,
                @Res() res: Response) {
    console.log('Twinning/api/my-settings/TMS/backup-user-list - Authorization: ' + authorization + ', forUserId: ' + forUserId);
    // Extract payload
    // let jwt = new JWT(authorization);
    let fileName = (forUserId !== '') ? 'mySettingsBackupBackupUser.json' : 'mySettingsBackupForUser.json';

    createReadStream(path.join(__dirname, './resources/json/app/' + fileName)).pipe(res);
  }

  @Get('Twinning/api/workflow-comments-print/:workflowType/:eventId')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  @Header('Content-Disposition', 'attachment; filename=Workflow_Comments_Extract.xlsx')
  extractWorkflowComments(@Headers('authorization') authorization: string,
                          @Param('workflowType') workflowType: number,
                          @Param('eventId') eventId: number,
                          @Res() res: Response) {
    console.log('Twinning/api/workflow-comments-print - Authorization: ' + authorization +
      ', workflowType: ' + workflowType + ', eventId: ' + eventId);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, './resources/tmsApp/Workflow_Comments_Extract.xlsx')).pipe(res);
  }

  @Get('Twinning/api/mail/TMS/consultation-email-check/:taskId')
  sendConsultationMailCheck(@Headers('authorization') authorization: string,
                            @Param('taskId') taskId: number,
                            @Res() res: Response) {
    console.log('Twinning/api/mail/TMS/consultation-email-check - Authorization: ' + authorization + ', taskId: ' + taskId);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, './resources/json/tmsApp/defaultRequestResult.json')).pipe(res);
  }

  @Get('Twinning/api/mail/TMS/consultation-email/:taskId')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/x-msg')
  @Header('Content-Disposition', 'attachment; filename=Consultation_mail.msg')
  sendConsultationMail(@Headers('authorization') authorization: string,
                       @Param('taskId') taskId: number,
                       @Res() res: Response) {
    console.log('Twinning/api/docs/web/10 - Authorization: ' + authorization + ', taskId: ' + taskId);

    createReadStream(path.join(__dirname, './resources/tmsApp/Consultation_mail.msg')).pipe(res);
  }

  @Get('Twinning/api/docs/web/10/:taskId/:userRoleId/:fileType')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/pdf')
  @Header('Content-Disposition', 'attachment; filename=TaskApprovalForm_29990.pdf')
  printApprovalForm(@Headers('authorization') authorization: string,
                    @Param('taskId') taskId: number,
                    @Param('userRoleId') userRoleId: number,
                    @Param('fileType') fileType: string,
                    @Res() res: Response) {
    console.log('Twinning/api/docs/web/10 - Authorization: ' + authorization +
      ', taskId: ' + taskId + ', userRoleId: ' + userRoleId + ', fileType: ' + fileType);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, './resources/tmsApp/TaskApprovalForm_29990.pdf')).pipe(res);
  }

  @Get('Twinning/api/job/startScheduler')
  startBackgroundJobs(@Headers('authorization') authorization: string): boolean {
    console.log('Twinning/api/job/startScheduler - Authorization: ' + authorization);
    // Extract payload
    // let jwt = new JWT(authorization);

    return true;
  }

  @Get('Twinning/api/job/stopScheduler')
  stopBackgroundJobs(@Headers('authorization') authorization: string): boolean {
    console.log('Twinning/api/job/stopScheduler - Authorization: ' + authorization);
    // Extract payload
    // let jwt = new JWT(authorization);

    return true;
  }

  @Get('Twinning/api/docs/:reportType/:id/:userRoleId/pdf/resp')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/pdf')
  @Header('Content-Disposition', 'attachment; filename=AF_67400.pdf')
  downloadAFOFDocument(@Headers('authorization') authorization: string,
                       @Param('reportType') reportType: number,
                       @Param('id') id: number,
                       @Param('userRoleId') userRoleId: number,
                       @Res() res: Response) {
    console.log('Twinning/api/docs - Authorization: ' + authorization +
      ', reportType: ' + reportType + ', id: ' + id + ', userRoleId: ' + userRoleId + ' - /pdf/resp');
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, './resources/tmsApp/AF_67400.pdf')).pipe(res);
  }

  @Get('Twinning/api/docs/agenda/existAgenda/:eventId')
  existAgenda(@Headers('authorization') authorization: string,
              @Param('eventId') eventId: number): boolean {
    console.log('Twinning/api/docs/agenda/existAgenda - Authorization: ' + authorization + ', eventId: ' + eventId);
    // Extract payload
    // let jwt = new JWT(authorization);

    return false;
  }

  @Post('Twinning/api/docs/agenda/create')
  setAgenda(@Headers('authorization') authorization: string, @Body() body: any): boolean {
    console.log('Twinning/api/docs/agenda/create - Authorization: ' + authorization + ', Body: ' + JSON.stringify(body));
    // Extract payload
    // let jwt = new JWT(authorization);

    return true;
  }

  @Get('Twinning/api/mail/forecast-mailing/:taiexContractorId/:budgetTeamId/:nbrBudgetLines/:periodExtracted/:printoutFile')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/x-msg')
  @Header('Content-Disposition', 'attachment; filename=Forecast_IBF_-_7_AGR_Q2.msg')
  mailingSurvey(@Headers('authorization') authorization: string,
                @Param('taiexContractorId') taiexContractorId: number,
                @Param('budgetTeamId') budgetTeamId: number,
                @Param('nbrBudgetLines') nbrBudgetLines: number,
                @Param('quarterId') quarterId: number,
                @Param('printoutFile') printoutFile: string,
                @Res() res: Response) {
    console.log('Twinning/api/mail/forecast-mailing - Authorization: ' + authorization +
      ', taiexContractorId: ' + taiexContractorId + ', budgetTeamId: ' + budgetTeamId +
      ', nbrBudgetLines: ' + nbrBudgetLines + ', quarterId: ' + quarterId + ', printoutFile: ' + printoutFile);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, './resources/financial/Forecast_IBF_-_7_AGR_Q2.msg')).pipe(res);
  }

  @Get('Twinning/api/mail/task-teamleader-email/:taskId')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/x-msg')
  @Header('Content-Disposition', 'attachment; filename=New_Task_For_Teamleader_29771.msg')
  getTasksTeamleaderEmail(@Headers('authorization') authorization: string,
                          @Param('taskId') taskId: number,
                          @Res() res: Response) {
    console.log('Twinning/api/mail/task-teamleader-email - Authorization: ' + authorization + ', taskId: ' + taskId);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, './resources/tmsApp/New_Task_For_Teamleader_29771.msg')).pipe(res);
  }

  @Get('Twinning/api/user-details')
  getUserDetails(@Headers('authorization') authorization: string): any {
    console.log('Twinning/api/user-details - Authorization: ' + authorization);

    return {};
  }

  @Post('TMSWebRestrict/login')
  validateLogin(@Body() body: any): object {
    console.log('TMSWebRestrict/login - Body: ' + JSON.stringify(body));
    let result = {};

    const loginType = Number(body.username.split('/')[1]);

    if (loginType === 16 || loginType === 32) {
      if (body.username.startWith('reconfirm') === true) {
        result = {
          'result': true,
          'message': '',
          'messageType': 1,
          'data': {
            'autoValidationDate': '19/05/2020',
            'emailVerified': true,
            'passwordHashAlg': 'SHA-512',
            'status': 4,
            // tslint:disable-next-line:max-line-length
            'userToken': 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbnR5cGUiOjYsInJvbGUiOjE2LCJpZCI6MSwiZW1haWwiOiJ3c0B0YWlleC5iZSIsInVzZXJOYW1lIjoiUnV0aCBNQVJUSU4iLCJhY3Rpb24iOjF9.mZG2sD6YkXMjDFAeL3xRU04NQfRzRldZOi7Mngo4Vz4RggwiFsaR8FBInRB3NYL9ghKlVZzEqwUTrDn0ANW_HA'
          }
        };
      } else {
        result = {
          'result': true,
          'message': '',
          'messageType': 1,
          'data': {
            'autoValidationDate': '19/05/2020',
            'emailVerified': true,
            'passwordHashAlg': 'SHA-512',
            'status': 4,
            // tslint:disable-next-line:max-line-length
            'userToken': 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbnR5cGUiOjYsInJvbGUiOjE2LCJpZCI6MSwiZW1haWwiOiJ3c0B0YWlleC5iZSIsInVzZXJOYW1lIjoiUnV0aCBNQVJUSU4ifQ.XUh5eMNuLs6SFxD4n2COg4ihfcDbpiO6_2G3M__MLdxgZOZ6EPHga4o9ISFLDL6BOOAtap70um-yFwpFV9X-PQ'
          }
        };
      }
    } else if (loginType === 2) {
      result = {
        'result': true,
        'message': '',
        'messageType': 1,
        'data': {
          'autoValidationDate': '19/05/2020',
          'emailVerified': true,
          'passwordHashAlg': 'SHA-512',
          'status': 4,
          // tslint:disable-next-line:max-line-length
          'userToken': 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbnR5cGUiOjYsInJvbGUiOjIsImlkIjoyLCJlbWFpbCI6IndzQHRhaWV4LmJlIiwidXNlck5hbWUiOiJKb2huIFNNSVRIIn0.PRqTysLzye2yFymIe_lRYq2eeQYKMk_ZrV4tEBx3zPGNewZT_ThFv0-Y9-KQ4h2YOh6PaGObnS3y6HPLynaFKg'
        }
      };
    } else {
      result = {
        'result': true,
        'message': '',
        'messageType': 1,
        'data': {
          'status': 0,
          // tslint:disable-next-line:max-line-length
          'userToken': 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbnR5cGUiOjYsInJvbGUiOjE2LCJpZCI6MSwiZW1haWwiOiJ3c0B0YWlleC5iZSIsInVzZXJOYW1lIjoiUnV0aCBNQVJUSU4iLCJhY3Rpb24iOjF9.mZG2sD6YkXMjDFAeL3xRU04NQfRzRldZOi7Mngo4Vz4RggwiFsaR8FBInRB3NYL9ghKlVZzEqwUTrDn0ANW_HA'
        }
      };
    }

    // set last login session value
    AppController.userToken = result['data'] ? result['data'].userToken : undefined;

    return result;
  }

  @Get('TMSWebRestrict/api/edb/logout')
  doLogout(@Headers('authorization') authorization: string): void {
    console.log('TMSWebRestrict/api/edb/logout - Authorization: ' + authorization);

    AppController.userToken = undefined;
  }

  @Get('TMSWebRestrict/api/edb/checkSSO')
  checkSSO(@Headers('authorization') authorization: string): object {
    console.log('TMSWebRestrict/api/edb/checkSSO - Authorization: ' + authorization + ', output: ' + AppController.userToken);

    return {
      'result': true,
      'message': '',
      'messageType': 1,
      'data': {
        'status': 0,
        'userToken': AppController.userToken
      }
    };
  }

  @Get('Twinning/api/logout-from-tms')
  logoutFromTms(@Headers('authorization') authorization: string): string {
    console.log('Twinning/api/logout-from-tms - Authorization: ' + authorization);

    return '';
  }

  @Post('Twinning/api/diagnostic/tms-ui-log')
  tmsUILog(@Headers('authorization') authorization: string, @Body() body: any): boolean {
    console.log('Twinning/api/diagnostic/tms-ui-log - Body: ' + JSON.stringify(body));

    return true;
  }

  @Post('TMSWebRestrict/api/diagnostic/tms-ui-log')
  tmsWebUILog(@Headers('authorization') authorization: string, @Body() body: any): boolean {
    console.log('TMSWebRestrict/api/diagnostic/tms-ui-log - Body: ' + JSON.stringify(body));

    return true;
  }

  @Get('Twinning/api/application-message')
  getTMSApplicationMessage(@Res() res: Response) {
    console.log('TMSWebRestrict/api/application-message');

    createReadStream(path.join(__dirname, './resources/json/app/applicationMessage.json')).pipe(res);
  }

  @Get('TMSWebRestrict/api/application-message')
  getTMSWEBApplicationMessage(@Res() res: Response) {
    console.log('TMSWebRestrict/api/application-message');

    createReadStream(path.join(__dirname, './resources/json/app/applicationMessage.json')).pipe(res);
  }

  @Get('Twinning/api/job/:reportId/:userCategoryId')
  executeJob(@Headers('authorization') authorization: string,
             @Param('reportId') reportId: number,
             @Param('userCategoryId') userCategoryId: number,
             @Res() res: Response) {
    console.log('Twinning/api/job - Authorization: ' + authorization + ', reportId: ' + reportId + ', userCategoryId: ' + userCategoryId);

    createReadStream(path.join(__dirname, './resources/json/tmsApp/defaultRequestResult.json')).pipe(res);
  }

  @Get('Twinning/api/nationalities')
  getNationalityList(@Res() res: Response) {
    console.log('Twinning/api/nationalities');

    createReadStream(path.join(__dirname, './resources/json/tmsApp/nationalities.json')).pipe(res);
  }
}
