/* tslint:disable */
import {
  Body,
  Controller,
  Get,
  Header,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query, Req,
  Res,
  UploadedFiles,
  UseInterceptors
} from '@nestjs/common';

import { createReadStream } from 'fs';
import * as path from 'path';
import { Request, Response } from 'express';
import { diskStorage } from 'multer';

import { enTokenType, JWT } from '../common/generalRoutines';
import { AnyFilesInterceptor } from '@nestjs/platform-express';

export enum enContactType {
  NONE = 0,
  IBU_CH = 1,
  CCH = 5,
  LCO = 20
}

@Controller('TMSWebRestrict/api/participant-portal')
export class ParticipantPortalController {
  public static userToken: string;
  public static securityCode: string;

  constructor() {
    ParticipantPortalController.userToken = '';
    ParticipantPortalController.securityCode = null;
  }

  @Post('request-login-token')
  requestLoginToken(@Body() body: any): object {
    console.log('TMSWebRestrict/api/participant-portal/request-login-token - Body: ' + JSON.stringify(body));
    let result = {
      'result': false,
      'message': '',
      'messageType': 4
    };

    if (body.tokenType === enTokenType.PARTPORT) {
      if (body.profEmail.contains('werner')) {
        result = {
          'result': true,
          'message': null,
          'messageType': 1
        };

        // set last login session value - token send via email
        ParticipantPortalController.userToken = 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbnR5cGUiOjEwLCJlbWFpbCI6Indlcm5lci5zdGFwcGFlcnRzQGV4dC5lYy5ldXJvcGEuZXUiLCJwYXJ0aWNpcGFudElkIjpudWxsfQ.30Srx0NgFj9aNkr2BgcxHboR96S3kemPk-SEmMhBMI0nFG-pQBPghv_erJprane6XENCbEmbbSRNasFilkC9YA';
      }
    }

    return result;
  }

  @Get('valid-login-token')
  validLoginToken(@Query('userToken') userToken: string = '', @Query('securityCode') securityCode: string = ''): object {
    console.log('TMSWebRestrict/api/participant-portal/valid-login-token - userToken: ' + userToken + ' - securityCode: ' + securityCode);

    // Extract payload
    let backEndJWT = ParticipantPortalController.userToken ? new JWT(ParticipantPortalController.userToken) : undefined;
    let jwt = userToken ? new JWT(userToken) : undefined;
    if (backEndJWT && jwt && backEndJWT.payLoad.email === jwt.payLoad.email) {
      return {
        'result': true,
        'message': '',
        'messageType': 1
      };
    } else if (ParticipantPortalController.securityCode !== null && ParticipantPortalController.securityCode === securityCode) {
      ParticipantPortalController.securityCode = undefined;
      ParticipantPortalController.userToken = userToken;
      return {
        'result': true,
        'message': '',
        'messageType': 1
      };
    } else  {
      ParticipantPortalController.userToken = undefined;
      ParticipantPortalController.securityCode = '1231231';
      return {
        'result': false,
        'message': '',
        'messageType': 1
      };
    }
  }

  @Get('logout')
  doLogout(@Headers('authorization') authorization: string): void {
    console.log('TMSWebRestrict/api/participant-portal/logout - Authorization: ' + authorization);

    ParticipantPortalController.userToken = '';
    ParticipantPortalController.securityCode = null;
  }

  @Get('checkSSO')
  checkSSO(@Headers('authorization') authorization: string): object {
    console.log('TMSWebRestrict/api/participant-portal/checkSSO - Authorization: ' + authorization + ', output: ' + ParticipantPortalController.userToken);

    return {
      'result': true,
      'message': '',
      'messageType': 1,
      'data': {
        'userToken': ParticipantPortalController.userToken
      }
    };
  }

  @Post('login')
  validateLogin(@Body() body: any): object {
    console.log('TMSWebRestrict/api/participant-portal/login - Body: ' + JSON.stringify(body));
    let result = {};

    const loginType = Number(body.username.split('/')[1]);

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

    // set last login session value
    ParticipantPortalController.userToken = result['data'] ? result['data'].userToken : undefined;

    return result;
  }

  @Post('event-registration-list')
  getEventRegistrationList(@Headers('authorization') authorization: string,
                           @Body() body: any,
                           @Res() res: Response): void {
    console.log('TMSWebRestrict/api/participant-portal/event-registration-list - Authorization: ' + authorization + ', body: ' + JSON.stringify(body));

    createReadStream(path.join(__dirname, '../resources/json/participant-portal/eventRegistrationList.json')).pipe(res);
  }

  @Get('event-registrations-print')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  @Header('Content-Disposition', 'attachment; filename=eventsParticipated.xlsx')
  extractEventsParticipated(@Headers('authorization') authorization: string,
                            @Query('filters') filters: string,
                            @Res() res: Response) {
    console.log('TMSWebRestrict/api/participant-portal/event-registrations-print - Authorization: ' + authorization + ', filters: ' + filters);

    createReadStream(path.join(__dirname, '../resources/tmsApp/eventsParticipated.xlsx')).pipe(res);
  }

  @Get('event-registration-detail')
  getInviter(@Headers('authorization') authorization: string,
             @Query('rowToken') rowToken: string,
             @Res() res: Response): void {
    let jwt = new JWT(rowToken);
    console.log('TMSWebRestrict/api/participant-portal/event-registration-detail - Authorization: ' + authorization +
      ', rowToken payLoad: ' + jwt.payLoad);

    createReadStream(path.join(__dirname, '../resources/json/participant-portal/eventRegistrationDetail_' + jwt.payLoad.participantId + '.json')).pipe(res);
  }

  @Get('delete-presentation/:documentId')
  deletePresentation(@Headers('authorization') authorization: string,
                     @Param('documentId') documentId: number,
                     @Res() res: Response) {
    console.log('TMSWebRestrict/api/participant-portal/delete-presentation - Authorization: ' + authorization + ', documentId: ' + documentId);

    createReadStream(path.join(__dirname, '../resources/json/participant-portal/delete-presentation.json')).pipe(res);
  }

  @Post('upload-presentation')
  @Header('Content-Type', 'application/json')
  @UseInterceptors(AnyFilesInterceptor({ storage: diskStorage({ destination: path.join(__dirname, '../uploads') }) }))
  uploadPresentation(@Headers('authorization') authorization: string,
                     @Body() body: any,
                     @UploadedFiles() files,
                     @Req() req: Request,
                     @Res() res: Response) {
    console.log('TMSWebRestrict/api/participant-portal/upload-presentation - Authorization: ' + authorization +
      ', Body: ' + JSON.stringify(body));

    try {
      // get presentation data and complete it
      const publishedDocumentList = JSON.parse(body.publishedDocumentList);
      // file.filename contains the filename of the document in upploads.
      // Check it fie is attached
      // if (files.size > 0) {
      //   // fs.readFile(file.buffer, 'binary', (err, fileData) => {
      //   //
      //   //   const binBuff = new Buffer(fileData, 'binary');
      //   //
      //   //   // Delete file from filesystem
      //   //   fs.unlink(file.path, () => {
      //   //     // file deleted
      //   //   });
      //   // });
      //
      //
      // }
      createReadStream(path.join(__dirname, '../resources/json/participant-portal/upload-presentation.json')).pipe(res);
      res.status(200);
    } catch (err) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('General error during saving of the presentation.');
    }
  }

  @Get('contact-email/:eventId/:contactType')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/x-msg')
  @Header('Content-Disposition', 'attachment; filename=contact_mail_80390.msg')
  extractContactEmail(@Headers('authorization') authorization: string,
                     @Param('eventId', ParseIntPipe) eventId: number,
                     @Param('contactType', ParseIntPipe) contactType: number,
                     @Res() res: Response) {
    console.log('TMSWebRestrict/api/participant-portal/contact-mail - Authorization: ' + authorization +
      ', eventId: ' + eventId + ', contactType: ' + contactType);

    switch (contactType) {
      case enContactType.IBU_CH:
        createReadStream(path.join(__dirname, '../resources/participant-portal/contactMail_IBU_CH.msg')).pipe(res);
        break;
      case enContactType.CCH:
        createReadStream(path.join(__dirname, '../resources/participant-portal/contactMail_CCH.msg')).pipe(res);
        break;
      case enContactType.LCO:
        createReadStream(path.join(__dirname, '../resources/participant-portal/contactMail_LCO.msg')).pipe(res);
        break;
      default:
        res.status(HttpStatus.NOT_FOUND).send('Mail not found.');
    }
  }

  @Get('calendar-invitation/:participantId')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'text/v-calendar')
  @Header('Content-Disposition', 'attachment; filename=calendar_invitation_80390.ics')
  extractCalendarInvitation(@Headers('authorization') authorization: string,
                            @Param('participantId', ParseIntPipe) participantId: number,
                            @Res() res: Response) {
    console.log('TMSWebRestrict/api/participant-portal/calendar-invitation - authorization: ' + authorization +
      ', participantId: ' + participantId);

    createReadStream(path.join(__dirname, '../resources/participant-portal/calendar_invitation.ics')).pipe(res);
  }

  @Get('video-presentation/:documentId')
  getVideoPresentation(@Headers('authorization') authorization: string,
                       @Query('id') id: string,
                       @Res() res: Response) {
    console.log('TMSWebRestrict/api/participant-portal/video-presentation - Authorization: ' + authorization + ', id: ' + id);

    createReadStream(path.join(__dirname, '../resources/json/participant-portal/video-presentation.json')).pipe(res);
  }
}
