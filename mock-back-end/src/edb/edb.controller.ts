import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  Res,
  HttpCode,
  HttpStatus,
  Header,
  Headers, Param, Put, HttpException
} from '@nestjs/common';

import { Roles } from '../common/roles.decorator';
import { RolesGuard } from '../common/roles.guard';
import { createReadStream } from 'fs';
import * as path from 'path';
import { Response } from 'express';

@Controller('TMSWebRestrict/api/edb')
@UseGuards(RolesGuard)
export class EdbController {
  // public static timeoutError: boolean = false;

  @Post('event-list')
  @Roles('admin')
  getEventList(@Body() body: any,
               @Res() res: Response) {
    console.log('edb/event-list - Body: ' + JSON.stringify(body));

    // EdbController.timeoutError = !EdbController.timeoutError;
    // if (EdbController.timeoutError) {
    //   throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);
    // }
    createReadStream(path.join(__dirname, '../resources/json/edb/event-list.json')).pipe(res);
  }

  @Post('expert-list')
  @Roles('admin')
  getExpertList(@Body() body: any,
                @Res() res: Response) {
    console.log('edb/expert-list - Body: ' + JSON.stringify(body));

    createReadStream(path.join(__dirname, '../resources/json/edb/expert-list.json')).pipe(res);
  }

  @Get('confirmEmail')
  confirmEmail(@Query('usertoken') usertoken: string,
               @Res() res: Response) {
    console.log('edb/confirmEmail - usertoken: ' + usertoken);

    createReadStream(path.join(__dirname, '../resources/json/edb/confirm-email.json')).pipe(res);
  }

  @Get('confirmProfile')
  confirmProfile(@Query('usertoken') usertoken: string,
                 @Res() res: Response) {
    console.log('edb/confirmPprofile - usertoken: ' + usertoken);

    createReadStream(path.join(__dirname, '../resources/json/edb/confirm-profile.json')).pipe(res);
  }

  @Get('profile')
  getProfile(@Query('usertoken') userToken: string,
             @Query('personId') personId: any,
             @Res() res: Response) {
    console.log('edb/profile - usertoken: ' + userToken + ', personId: ' + personId);

    if (personId !== undefined) {
      createReadStream(path.join(__dirname, '../resources/json/edb/profile-user-ncp-validation.json')).pipe(res);
    } else {
      createReadStream(path.join(__dirname, '../resources/json/edb/profile-user.json')).pipe(res);
    }
  }

  @Get('experts-print')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  @Header('Content-Disposition', 'attachment; filename=experts.xlsx')
  printExpertList(@Headers('authorization') authorization: string, @Headers('filters') filters: string, @Res() res: Response) {
    console.log('edb/experts-print - Authorization: ' + authorization + ', filters: ' + filters);

    createReadStream(path.join(__dirname, '../resources/edb/experts.xlsx')).pipe(res);
  }

  @Post('register')
  setRegistration(@Body() body: any): object {
    console.log('edb/register - Body: ' + JSON.stringify(body));
    const data = {
      'result': true,
      'message': '',
      'messageType': 1,
      'data': {
        // tslint:disable-next-line:max-line-length
        'userToken': 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbnR5cGUiOjYsInJvbGUiOjE2LCJpZCI6MSwiZW1haWwiOiJ3c0B0YWlleC5iZSIsInVzZXJOYW1lIjoiUnV0aCBNQVJUSU4ifQ.XUh5eMNuLs6SFxD4n2COg4ihfcDbpiO6_2G3M__MLdxgZOZ6EPHga4o9ISFLDL6BOOAtap70um-yFwpFV9X-PQ'
      }
    };

    return data;
  }

  @Post('profile')
  setProfile(@Body() body: any): object {
    console.log('edb/profile - Body: ' + JSON.stringify(body));
    const data = {
      'result': true,
      'message': '',
      'messageType': 1,
      'data': {
        // tslint:disable-next-line:max-line-length
        'userToken': 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbnR5cGUiOjYsInJvbGUiOjE2LCJpZCI6MSwiZW1haWwiOiJ3c0B0YWlleC5iZSIsInVzZXJOYW1lIjoiUnV0aCBNQVJUSU4ifQ.XUh5eMNuLs6SFxD4n2COg4ihfcDbpiO6_2G3M__MLdxgZOZ6EPHga4o9ISFLDL6BOOAtap70um-yFwpFV9X-PQ'
      }
    };

    return data;
  }

  @Post('validate-expert')
  @Roles('admin')
  validateExpert(@Body() body: any): object {
    console.log('tmsweb/validate-expert - Body: ' + JSON.stringify(body));
    const data = {
      'result': true,
      'message': '',
      'messageType': 1
    };

    return data;
  }

  @Post('refuse-expert')
  @Roles('admin')
  refuseExpert(@Body() body: any): object {
    console.log('tmsweb/refuse-expert - Body: ' + JSON.stringify(body));
    const data = {
      'result': true,
      'message': '',
      'messageType': 1
    };

    return data;
  }

  @Get('check-email')
  @Get('check-email/:eventId')
  checkEmail(@Param('eventId') eventId: string, @Query('email') email: string): object {
    console.log('TMSWebRestrict/api/edb/check-email/' + eventId + ', email: ' + email);
    let data = null;
    if (email === 'exist@taiex.be') { // existing email
      data = { userToken: null, status: 64, passwordHashAlg: null, autoValidationData: null };
    } else if (email === 'blocked@taiex.be') { // blocked email
      data = { userToken: null, status: 8, passwordHashAlg: null, autoValidationData: null };
    } else {
      data = { userToken: null, status: null, passwordHashAlg: null, autoValidationData: null };
    }

    return data;
  }

  @Put('interest/:interested')
  showInterest(@Headers('authorization') authorization: string,
               @Param('interested') interested: boolean,
               @Body() body: any): object {
    console.log('TMSWebRestrict/api/edb/interest/' + ', interested: ' + interested + ', Body: ' + JSON.stringify(body));
    let data: object = null;
    if (interested === true) {
      data = { 'result': true, 'message': null, 'messageType': 1, 'data': 'CREATED' };
    } else {
      data = { 'result': true, 'message': null, 'messageType': 1, 'data': 'DELETED' };
    }

    return data;
  }

  @Get('printProfile')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/pdf')
  @Header('Content-Disposition', 'attachment; filename=Werner_Stappaerts.pdf')
  printApprovalForm(@Headers('authorization') authorization: string,
                    @Query('personId') personId: string,
                    @Res() res: Response) {
    console.log('Twinning/api/docs/web/10 - Authorization: ' + authorization +
      ', personId: ' + personId);

    createReadStream(path.join(__dirname, './resources/edb/Werner_Stappaerts.pdf')).pipe(res);
  }

  @Get('events-print')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  @Header('Content-Disposition', 'attachment; filename=assignments.xlsx')
  printEventList(@Headers('authorization') authorization: string, @Headers('filters') filters: string, @Res() res: Response) {
    console.log('edb/experts-print - Authorization: ' + authorization + ', filters: ' + filters);

    createReadStream(path.join(__dirname, '../resources/edb/assignments.xlsx')).pipe(res);
  }

  @Get('profile-chapters')
  getProfileChapters(@Headers('authorization') authorization: string): object {
    console.log('edb/profile-chapters - Authorization: ' + authorization);

    return [11719005, 11719039, 11719007, 11719006];
  }

  @Get('lost-password')
  public lostPassword(@Query('email') email: string, @Query('loginType') loginType: string): object {
    console.log('edb/lost-password - email: ' + email + ', loginType: ' + loginType);
    const data = {
      'result': true,
      'message': null,
      'messageType': 1
    };

    return data;
  }

  @Post('reset-password')
  resetPassword(@Body() body: any): object {
    console.log('edb/reset-password - Body: ' + JSON.stringify(body));
    const data = {
      'result': true,
      'message': null,
      'messageType': 1
    };

    return data;
  }

  @Post('change-password')
  changePassword(@Body() body: any): object {
    console.log('edb/change-password - Body: ' + JSON.stringify(body));
    const data = {
      'result': true,
      'message': null,
      'messageType': null
    };

    return data;
  }

  @Get('send-feedback/:reportType/:menuType')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/x-msg')
  @Header('Content-Disposition', 'attachment; filename=assistance.msg')
  sendFeedback(@Headers('authorization') authorization: string,
               @Param('reportType') reportType: string,
               @Param('menuType') menuType: string,
               @Res() res: Response) {
    console.log('Twinning/api/edb/send-feedback - Authorization: ' + authorization +
      ', reportType: ' + reportType + ', menuType: ' + menuType);

    let filename: string = '';
    switch (reportType) {
    case '1':
      filename = 'email_feedback.msg';
      break;
    case '2':
      filename = 'email_BugReport.msg';
      break;
    }

    createReadStream(path.join(__dirname, '../resources/edb/' + filename)).pipe(res);
  }
}
