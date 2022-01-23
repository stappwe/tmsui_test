/* tslint:disable:max-line-length */
import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Res
} from '@nestjs/common';

import { Response } from 'express';
import { createReadStream } from 'fs';
import * as path from 'path';

import { GeneralRoutines } from '../common/generalRoutines';

export enum enDashboardListType {
  AF = 1,
  OF = 2,
  ER = 3,
  INVOICE = 4,
  TASK = 5,
  APPROVAL = 6
}

export enum enGeneratedReportType {
  CHECKLIST = 1,
  EXPERT_MISSION = 2,
  AF_SIGN = 3,
  OF_SIGN = 4
}

@Controller('Twinning/api/dashboard')
export class DashboardController {
  public static i: number = 0;

  @Get('get-account-coCaseHandlers')
  getListOfUsers(@Headers('authorization') authorization: string, @Res() res: Response) {
    console.log('Twinning/api/dashboard/get-account-coCaseHandlers - Authorization: ' + authorization);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/dashboard/listOfACH.json')).pipe(res);
  }

  @Get('approval-task-decisions')
  getApprovalTaskDecisionList(@Headers('authorization') authorization: string, @Res() res: Response) {
    console.log('Twinning/api/dashboard/approval-task-decisions - Authorization: ' + authorization);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/dashboard/approvalTaskDecisions.json')).pipe(res);
  }

  @Get('workflow-comments/:type/:id')
  getWorkflowComments(@Headers('authorization') authorization: string,
                      @Param('type') type: number,
                      @Param('id') id: number,
                      @Res() res: Response) {
    console.log('Twinning/api/dashboard/workflow-comments - Authorization: ' + authorization +
      ', type: ' + type + ', id: ' + id );
    // Extract payload
    // let jwt = new JWT(authorization);

    let filename = path.join(__dirname, '../resources/json/dashboard/WC_' + id + '.json');
    if (GeneralRoutines.fileExist(filename)) {
      createReadStream(filename).pipe(res);
    } else {
      if (type === 1) {
        filename = path.join(__dirname, '../resources/json/dashboard/WC_27271.json');
      } else if (type === 2) {
        filename = path.join(__dirname, '../resources/json/dashboard/WC_65690.json');
      }
      createReadStream(filename).pipe(res);
      // res.status(HttpStatus.OK).send([]);
    }
  }

  @Get('TMS/task-approval-details/:userRoleId/:taskId')
  getTaskApproval(@Headers('authorization') authorization: string,
                  @Param('userRoleId') userRoleId: number,
                  @Param('taskId') taskId: number,
                  @Res() res: Response) {
    console.log('Twinning/api/dashboard/TMS/task-approval-details - Authorization: ' + authorization +
      ', userRoleId: ' + userRoleId + ', taskId: ' + taskId );
    // Extract payload
    // let jwt = new JWT(authorization);

    let filename = path.join(__dirname, '../resources/json/dashboard/taskApprovalQuestion_' + taskId + '.json');
    if (GeneralRoutines.fileExist(filename)) {
      createReadStream(filename).pipe(res);
    } else {
      createReadStream(path.join(__dirname, '../resources/json/dashboard/taskApprovalQuestion_Blanco.json')).pipe(res);
    }
  }

  @Post('TMS/set-task-approval-details/:userRoleId')
  setTaskApproval(@Headers('authorization') authorization: string,
                  @Param('userRoleId') userRoleId: number,
                  @Body() body: any,
                  @Res() res: Response) {
    console.log('Twinning/api/dashboard/TMS/set-task-approval-details - Authorization: ' + authorization +
      ', userRoleId: ' + userRoleId + ', Body: ' + JSON.stringify(body));
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/dashboard/setTaskApproval.json')).pipe(res);
  }

  @Delete('TMS/task-approval/:userRoleId')
  deleteTaskApproval(@Headers('authorization') authorization: string,
                     @Param('userRoleId') userRoleId: number,
                     @Query('jwt') jwt: string,
                     @Res() res: Response): boolean {
    console.log('Twinning/api/dashboard/TMS/set-task-approval-details - Authorization: ' + authorization +
      ', userRoleId: ' + userRoleId + ', jwt: ' + jwt);
    // Extract payload
    // let jwt = new JWT(authorization);

    return true;
  }

  @Get('list/:dashboardListType/:userRoleId/:lastUpdateDate')
  getEventsTasks(@Headers('authorization') authorization: string,
                 @Param('dashboardListType') dashboardListType: Number,
                 @Param('userRoleId') userRoleId: number,
                 @Param('lastUpdateDate') lastUpdateDate: number,
                 @Res() res: Response) {
    console.log('Twinning/api/dashboard/list - Authorization: ' + authorization +
      ', dashboardListType: ' + dashboardListType + ', userRoleId: ' + userRoleId + ', lastUpdateDate: ' + lastUpdateDate);
    // Extract payload
    // let jwt = new JWT(authorization);
    let filename: string = '../resources/json/dashboard/';
    switch (Number(dashboardListType)) {
    case enDashboardListType.AF:
      if (DashboardController.i === 5) {
        DashboardController.i = 0;
        filename = 'AFList_ECAS.json';
      } else {
        DashboardController.i++;
        filename += 'AFList_' + userRoleId + '.json';
      }
      break;
    case enDashboardListType.OF:
      filename += 'OFList_' + userRoleId + '.json';
      break;
    case enDashboardListType.ER:
      filename += 'ERList_' + userRoleId + '.json';
      break;
    case enDashboardListType.TASK:
      filename += 'TaskList_' + userRoleId + '.json';
      break;
    case enDashboardListType.APPROVAL:
      filename += 'TaskApprovalList.json';
      break;
    default:
      filename += 'blancoList.json';
    }

    if (GeneralRoutines.fileExist(path.join(__dirname, filename))) {
      createReadStream(path.join(__dirname, filename)).pipe(res);
    } else {
      createReadStream(path.join(__dirname, '../resources/json/dashboard/blancoList.json')).pipe(res);
    }
  }

  @Get('invoice-list/:userRoleId/:taiexContractorId/:invDate')
  getInvoiceList(@Headers('authorization') authorization: string,
                 @Param('userRoleId') userRoleId: number,
                 @Param('taiexContractorId') taiexContractorId: number,
                 @Param('invDate') invDate: string,
                 @Res() res: Response) {
    console.log('Twinning/api/dashboard/invoice-list - Authorization: ' + authorization +
      ', userRoleId: ' + userRoleId + ', taiexContractorId: ' + taiexContractorId + ', invDate: ' + invDate);

    let filename: string = '../resources/json/dashboard/InvoiceList_' + invDate + '_' + userRoleId + '.json';
    if (GeneralRoutines.fileExist(path.join(__dirname, filename))) {
      createReadStream(path.join(__dirname, filename)).pipe(res);
    } else {
      createReadStream(path.join(__dirname, '../resources/json/dashboard/InvoiceList_Blanco.json')).pipe(res);
    }
  }

  @Get('invoice-list-additional/:userRoleId/:taiexContractorId/:invDate')
  getInvoiceListAdditional(@Headers('authorization') authorization: string,
                           @Param('userRoleId') userRoleId: number,
                           @Param('taiexContractorId') taiexContractorId: number,
                           @Param('invDate') invDate: string,
                           @Res() res: Response) {
    console.log('Twinning/api/dashboard/invoice-list-additional - Authorization: ' + authorization +
      ', userRoleId: ' + userRoleId + ', taiexContractorId: ' + taiexContractorId + ', invDate: ' + invDate);

    let filename: string = '../resources/json/dashboard/InvoiceListAdditional_' + invDate + '_' + userRoleId + '.json';
    if (GeneralRoutines.fileExist(path.join(__dirname, filename))) {
      createReadStream(path.join(__dirname, filename)).pipe(res);
    } else {
      createReadStream(path.join(__dirname, '../resources/json/dashboard/InvoiceListAdditional_Blanco.json')).pipe(res);
    }
  }

  @Get('details/:dashboardListType/:userRoleId/:id')
  getDetails(@Headers('authorization') authorization: string,
             @Param('dashboardListType') dashboardListType: enDashboardListType,
             @Param('userRoleId') userRoleId: number,
             @Param('id') id: number,
             @Res() res: Response) {
    console.log('Twinning/api/dashboard/details - Authorization: ' + authorization +
      ', dashboardListType: ' + dashboardListType + ', userRoleId: ' + userRoleId + ', id: ' + id);

    let filename: string = '../resources/json/dashboard/';
    switch (Number(dashboardListType)) {
    case enDashboardListType.AF:
      filename += 'AFDetail_' + id + '_' + userRoleId + '.json';
      break;
    case enDashboardListType.OF:
      filename += 'OFDetail_' + id + '_' + userRoleId + '.json';
      break;
    case enDashboardListType.ER:
      filename += 'ERDetail_' + id + '_' + userRoleId + '.json';
      break;
    case enDashboardListType.TASK:
      filename += 'Task_' + id + '_' + userRoleId + '.json';
      break;
    case enDashboardListType.INVOICE:
      filename += 'Invoice_' + id + '_' + userRoleId + '.json';
      break;
    }
    if (GeneralRoutines.fileExist(path.join(__dirname, filename))) {
      createReadStream(path.join(__dirname, filename)).pipe(res);
    } else {
      res.status(HttpStatus.OK).send({});
    }
  }

  @Post('set-workflow-step/:userRoleId')
  saveWorkflowStep(@Headers('authorization') authorization: string,
                   @Param('userRoleId') userRoleId: number,
                   @Body() body: any): any {
    console.log('Twinning/api/dashboard/set-workflow-step - Authorization: ' + authorization +
      ', userRoleId: ' + userRoleId + ', Body: ' + JSON.stringify(body));

    return { 'result': true, 'message': '', 'messageType': 1, 'data': body.id };
  }

  @Post('set-event-list-hou/:userRoleId')
  saveEventListHoU(@Headers('authorization') authorization: string,
                   @Param('userRoleId') userRoleId: number,
                   @Body() body: any): object {
    console.log('Twinning/api/dashboard/set-event-list-hou - Authorization: ' + authorization +
      ', userRoleId: ' + userRoleId + ', Body: ' + JSON.stringify(body));
    // Extract payload
    // let jwt = new JWT(authorization);

    const result = {
      'result': true,
      'message': 'Changes saved successfully',
      'messageType': 1,
      'data': null
    };
    return result;
  }

  @Post('set-invoicing-period')
  saveInvoicingPeriod(@Headers('authorization') authorization: string,
                      @Body() body: any): object {
    console.log('Twinning/api/dashboard/set-invoicing-period - Authorization: ' + authorization +
      ', Body: ' + JSON.stringify(body));
    // Extract payload
    // let jwt = new JWT(authorization);

    const result = {
      'result': true,
      'message': 'The invoice period has been set for the following events: ' + body.eventIds.join(','),
      'messageType': 1,
      'data': null
    };
    return result;
  }

  @Post('set-account-co-casehandler')
  saveACH(@Headers('authorization') authorization: string, @Body() body: any): object {
    console.log('Twinning/api/dashboard/set-account-co-casehandler - Authorization: ' + authorization +
      ', Body: ' + JSON.stringify(body));
    // Extract payload
    // let jwt = new JWT(authorization);

    const result = {
      'result': true,
      'message': 'Changes saved successfully',
      'messageType': 1,
      'data': null
    };
    return result;
  }

  @Post('save-report/:reportType/:eventId')
  saveReport(@Headers('authorization') authorization: string,
             @Param('reportType') reportType: enGeneratedReportType,
             @Param('eventId') eventId: number,
             @Body() body: any): string {
    console.log('Twinning/api/dashboard/save-report - Authorization: ' + authorization +
      ', reportType: ' + reportType + ', eventId: ' + eventId + ', Body: ' + JSON.stringify(body));
    // Extract payload
    // let jwt = new JWT(authorization);

    return 'https://webgate.acceptance.ec.europa.eu/Twinning/api/TMS/getDocumentByKey?keyid=eyJhbGciOiJIUzI1NiJ9.eyJkSUQiOiI1MTg0ODQwIiwidGltZXN0YW1wIjoiMTU4MzM5MTk5ODUwOCJ9.vIHfstib0C7bFE5yl-1kIL3LMKNckUbRQjKO680ol8s';
  }

  @Get('use-generated-checklist/:eventId')
  userGeneratedChecklist(@Headers('authorization') authorization: string,
                         @Param('eventId') eventId: number): boolean {
    console.log('Twinning/api/dashboard/use-generated-checklist - Authorization: ' + authorization +
      ', eventId: ' + eventId);
    // Extract payload
    // let jwt = new JWT(authorization);

    return true;
  }

  @Get('blankChecklist')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  @Header('Content-Disposition', 'attachment; filename=Checklist_template_Q20_IBF_2016.xlsx')
  extractBlankChecklist(@Headers('authorization') authorization: string,
                        @Query('invoiceQuarter') invoiceQuarter: string,
                        @Res() res: Response) {
    console.log('Twinning/api/blankChecklist - Authorization: ' + authorization + ', invoiceQuarter: ' + invoiceQuarter);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/dashboard/Checklist_template_Q20_IBF_2016.xlsx')).pipe(res);
  }
}
