/* tslint:disable */
import { Body, Controller, Post, UseGuards, Get, Param, Headers, Res, HttpStatus, HttpCode, Header, Query } from '@nestjs/common';

import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';
import { JWT } from '../common/generalRoutines';
import { createReadStream } from "fs";
import * as path from "path";
import { Response } from 'express';

export enum enAppFormStatus {
  None = -1,
  Draft = 0,
  Submitted = 1,
  Submitted_and_validated = 2,
  Refused_by_CP = 3,
  Accepted = 4,
  Refused = 5,
  Done = 6,
  Translating = 7,
  Translated = 8
}

@Controller('TMSWebRestrict/api/appform')
@UseGuards(RolesGuard)
export class AppFormController {
  constructor() {
    // do nothing
  }

  @Post('list-projects')
  getProjectAppFormList(@Body() body: any, @Res() res: Response) {
    console.log('appform/list-projects - professionalEmail: ' + body);

    createReadStream(path.join(__dirname, '../resources/json/appForm/listProjects.json')).pipe(res);
  }

  @Post('list')
  @Roles('admin')
  getList(@Headers('authorization') authorization: string, @Body() body: any, @Res() res: Response) {
    console.log('appform/list - Authorization: ' + authorization + ' - Body: ' + JSON.stringify(body));
    let data = {};
    if (authorization) {
      createReadStream(path.join(__dirname, '../resources/json/appForm/appFormList.json')).pipe(res);
    } else {
      data = {
        'result': true,
        'message': 'An email has been send to your professional mailbox. Please continue from there. In case of any issues, please check the help guide',
        'messageType': 1
      };

      res.status(HttpStatus.OK).send(data);
    }
  }

  @Get('get')
  @Roles('admin')
  getAppForm(@Headers('authorization') authorization: string, @Res() res: Response) {
    console.log('appform/get - Authorization: ' + authorization);
    // Extract payload
    const jwt = new JWT(authorization);
    const filename = '../resources/json/appForm/appFormGet_' + jwt.payLoad.requestId + '.json';

    createReadStream(path.join(__dirname, filename)).pipe(res);
  }

  @Post('set/:submit/:encodedLanguage')
  @Roles('admin')
  setAppForm(@Param('submit') submit: string,
             @Param('encodedLanguage') encodedLanguage: string,
             @Body() body: any): object {
    console.log('appform/set - submit: ' + submit + ', encodedLanguage: ' + encodedLanguage + ', Body: ' + JSON.stringify(body));
    if (submit === 'true') {
      return {
        "result": true,
        "message": "Your application has been submitted successfully. Once validated, your request will receive an acknowledgement letter within 5 working days from TAIEX. You can always consult and follow up all your requests via the 'My list'",
        "messageType": 1,
        "data": {
          "userToken": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbnR5cGUiOjQsInRpbWVzdGFtcCI6MTU2MTk4NTAzMjQ5NCwidXNlclR5cGUiOjEsInByb2plY3RJZCI6MSwicmVxdWVzdElkIjotMSwiZW1haWwiOiJ3ZXJuZXIuc3RhcHBhZXJ0c0BleHQuZWMuZXVyb3BhLmV1In0.qiFc0cQOcSLuSKxDcE8INC-_gDWkn7zjzYDXdXK4Et_3l67zeZWhx60t0i4TGMBPHuJC8zZgQMMUq14OO5JooQ"
        }
      };
    } else {
      return {
        "result": true,
        "messageTranslationCode": "tmsweb.applicationForm.message.save",
        "messageType": 1
      };
    }
  }

  @Post('create-form/:projectappformid')
  createAppForm(@Param('projectappformid') projectAppFormId: number, @Headers('authorization') authorization: string,
                @Body() body: any): object {
    console.log('appform/create-form - projectAppFormId: ' + projectAppFormId + ', professionalEmail: ' + 'professionalEmail');
    if (authorization) {
      switch (projectAppFormId) {
        case 9:
          return {
            "result": true,
            "message": null,
            "messageType": null,
            "data": {
              "userToken": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbnR5cGUiOjQsInRpbWVzdGFtcCI6MjU2MTk4NTAzMjQ5NCwidXNlclR5cGUiOjEsInByb2plY3RJZCI6OSwicmVxdWVzdElkIjotMywiZW1haWwiOiJ3ZXJuZXIuc3RhcHBhZXJ0c0BleHQuZWMuZXVyb3BhLmV1In0.5dcF6Ml7z3asnwI7mbhixOPlA1rjn_9VpvQyB-L8VDHyQg-Z_HYKHYdzZA38abFANu2mVruBU2s3HCnOHpRSaw"
            }
          };
        default:
          return {
            "result": true,
            "message": null,
            "messageType": null,
            "data": {
              "userToken": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbnR5cGUiOjQsInRpbWVzdGFtcCI6MTU2MTk4NTAzMjQ5NCwidXNlclR5cGUiOjEsInByb2plY3RJZCI6MSwicmVxdWVzdElkIjotMSwiZW1haWwiOiJ3ZXJuZXIuc3RhcHBhZXJ0c0BleHQuZWMuZXVyb3BhLmV1In0.qiFc0cQOcSLuSKxDcE8INC-_gDWkn7zjzYDXdXK4Et_3l67zeZWhx60t0i4TGMBPHuJC8zZgQMMUq14OO5JooQ"
            }
          };
      }
    } else {
      return {
        "result": true,
        "message": "And email has been send to your professional mailbox. Please continue from there. In case of any issues, please check the help guide",
        "messageType": 1
      };
    }
  }

  @Get('delete-form')
  @Roles('admin')
  deleteAppForm(@Headers('authorization') authorization: string): object {
    console.log('appform/delete-form - Authorization: ' + authorization);
    return {
      "result": true,
      "message": "Request was deleted successfully",
      "messageType": 1,
      "data": {
        "userToken": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbnR5cGUiOjQsInRpbWVzdGFtcCI6MTU2MTk4NTAzMjQ5NCwidXNlclR5cGUiOjEsInByb2plY3RJZCI6MSwicmVxdWVzdElkIjotMSwiZW1haWwiOiJ3ZXJuZXIuc3RhcHBhZXJ0c0BleHQuZWMuZXVyb3BhLmV1In0.qiFc0cQOcSLuSKxDcE8INC-_gDWkn7zjzYDXdXK4Et_3l67zeZWhx60t0i4TGMBPHuJC8zZgQMMUq14OO5JooQ"
      }
    };
  }

  @Get('duplicate-form')
  @Roles('admin')
  duplicateAppForm(@Headers('authorization') authorization: string): object {
    console.log('appform/duplicate-form - Authorization: ' + authorization);
    return {
      "result": true,
      "message": "The request 25000 has been duplicated successfully",
      "messageType": 1,
      "data": {
        "requestId": 25000,
        "createDate": "26\/08\/2019",
        "instrument": "IPA, ENI",
        "requestType": "Workshop",
        "title": "Trainings for FADN advisors for the changes in the new Farm return methodology, data collection and data quality check",
        "submissionDate": "26\/08\/2019",
        "status": "Draft",
        "eventIds": null,
        "removable": 1,
        "canDuplicate": 1,
        "userToken": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbnR5cGUiOjQsInRpbWVzdGFtcCI6MTU2MTk4NTAzMjQ5NCwidXNlclR5cGUiOjEsInByb2plY3RJZCI6MSwicmVxdWVzdElkIjoxLCJlbWFpbCI6Indlcm5lci5zdGFwcGFlcnRzQGV4dC5lYy5ldXJvcGEuZXUifQ.VcYYWkuVh5zpkFiyvqGm2LyYswQVBnTsgdUSEXhr8tRDEh62p8kArMUM-l4sji1DB0ka85SfEnQXXZ8qog61Hg"
      }
    };
  }

  @Post('validate-form/:validate')
  validateAppForm(@Param('validate') validate: string, @Headers('authorization') authorization: string,
                  @Body() body: any): object {
    console.log('appform/validate-form - validate: ' + validate + ', Body: ' + JSON.stringify(body) + ', Authorization: ' + authorization);
    // Extract payload
    // let payLoad = new JWT(authorization);
    if (validate === 'true') {
      if (body.appFormStatus === enAppFormStatus.Translating) {
        return {
          "result": true,
          "message": "Successfully approved, translating",
          "messageType": 1,
          "data": {
            "translatingEmailURL": "http://google.be"
          }
        };
      } else {
        return {
          "result": true,
          "message": "Successfully approved",
          "messageType": 1
        };
      }
    } else {
      return {
        "result": true,
        "message": "Successfully refused",
        "messageType": 1
      };
    }
  }

  @Get('translation-email')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/x-msg')
  @Header('Content-Disposition', 'attachment; filename=Application_Form_Translate_Draft_Email.msg')
  extractTranslationEmail(@Headers('authorization') authorization: string,
                          @Query('userToken') userToken: string,
                          @Res() res: Response) {
    console.log('Twinning/api/appform/translation-email - Authorization: ' + authorization + ', userToken: ' + userToken);

    createReadStream(path.join(__dirname, '../resources/applicationForm/Application_Form_Translate_Draft_Email.msg')).pipe(res);
  }

  @Get('cancel-translation')
  cancelTranslation(@Headers('authorization') authorization: string): object {
    console.log('appform/cancel-translation - Authorization: ' + authorization);

    return {
      "result": true,
    };
  }
}

