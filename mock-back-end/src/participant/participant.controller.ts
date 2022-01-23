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
  Post, Query,
  Res
} from '@nestjs/common';

import { Response } from 'express';
import { createReadStream, readFileSync } from 'fs';
import * as path from 'path';
import { JWT, RequestResult } from '../common/generalRoutines';

type ResultList = { rows: Array<any>, rowCount: number };

@Controller('Twinning/api/TMS/PAX')
export class ParticipantController {
  @Get('inviters/inviter-detail/:eventInviterId')
  getInviter(@Headers('authorization') authorization: string,
             @Param('eventInviterId', ParseIntPipe) eventInviterId: number): object {
    console.log('Twinning/api/TMS/PAX/inviters/inviter-detail - Authorization: ' + authorization +
      ', eventInviterId: ' + eventInviterId);

    // get list and extract selected event id - test data
    let inviterList: Array<any> = JSON.parse(readFileSync(path.join(__dirname, '../resources/json/participant/inviterList.json')).toString());
    return inviterList.filter((item: any) => item.eventInviterId === eventInviterId)[0];
  }

  @Post('inviters/set-inviter')
  setInviter(@Headers('authorization') authorization: string,
             @Body() body: any): object {
    console.log('Twinning/api/TMS/PAX/inviters/set-inviter - Authorization: ' + authorization + ', Body: ' + JSON.stringify(body));

    let resultData: any = JSON.parse(readFileSync(path.join(__dirname, '../resources/json/participant/setInviter.json')).toString());
    body.inviterAdded = true;
    resultData.data = body;
    return resultData;
  }

  @Get('inviters/canImport-lcoNcp/:eventId')
  canImportLcoNcp(@Headers('authorization') authorization: string,
                  @Param('eventId', ParseIntPipe) eventId: number,
                  @Res() res: Response) {
    console.log('Twinning/api/TMS/PAX/inviters/canImport-lcoNcp - Authorization: ' + authorization +
      ', eventId: ' + eventId);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/participant/canImportLcoNcp.json')).pipe(res);
  }

  @Get('inviters/import-LCO/:eventId')
  importLCO(@Headers('authorization') authorization: string,
            @Param('eventId', ParseIntPipe) eventId: number,
            @Res() res: Response) {
    console.log('Twinning/api/TMS/PAX/inviters/import-LCO - Authorization: ' + authorization +
      ', eventId: ' + eventId);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/participant/importLCO.json')).pipe(res);
  }

  @Get('inviters/import-NCP/:eventId')
  importNCP(@Headers('authorization') authorization: string,
            @Param('eventId', ParseIntPipe) eventId: number,
            @Res() res: Response) {
    console.log('Twinning/api/TMS/PAX/inviters/import-NCP - Authorization: ' + authorization +
      ', eventId: ' + eventId);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/participant/importNCP.json')).pipe(res);
  }

  @Get('inviters/remove-inviter/:eventInviterId')
  removeEventInviter(@Headers('authorization') authorization: string,
            @Param('eventInviterId', ParseIntPipe) eventInviterId: number): boolean {
    console.log('Twinning/api/TMS/PAX/inviters/remove-inviter - Authorization: ' + authorization +
      ', eventInviterId: ' + eventInviterId);
    // Extract payload
    // let jwt = new JWT(authorization);

    return false;
  }

  @Get('inviters/list-inviters/:eventId')
  getInviterList(@Headers('authorization') authorization: string,
                 @Param('eventId', ParseIntPipe) eventId: number,
                 @Res() res: Response) {
    console.log('Twinning/api/TMS/PAX/inviters/list-inviters - Authorization: ' + authorization +
      ', eventId: ' + eventId);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/participant/inviterList.json')).pipe(res);
  }

  @Get('event/send-draft-email')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/x-msg')
  @Header('Content-Disposition', 'attachment; filename=Draft_Email.msg')
  createDraftEmail(@Headers('authorization') authorization: string,
                   @Query('selectedIds') selectedIds: Array<number>,
                   @Query('emailType', ParseIntPipe) emailType: number,
                   @Res() res: Response) {
    console.log('Twinning/api/TMS/PAX/event/send-draft-email - Authorization: ' + authorization +
      ', selectedIds: ' + selectedIds + ', emailType: ' + emailType);

    let filename: string = 'Registration_Draft_Email.msg';
    switch (emailType) {
    case 5: // contact person email
      filename = 'Event_Contact_Email.msg';
      break;
    case 6: // participant contact email
      filename = 'Event_Contact_Email.msg';
      break;
    case 7: // group participant contact email
      filename = 'Event_Contact_Email_Group.msg';
      break;
    }
    createReadStream(path.join(__dirname, '../resources/participant/' + filename)).pipe(res);
  }

  @Post('participants/list-participant')
  getParticipantRegistrationList(@Headers('authorization') authorization: string,
                                 @Body() body: any): RequestResult {
    console.log('Twinning/api/TMS/PAX/participants/list-participant - Authorization: ' + authorization +
      ', body: ' + JSON.stringify(body));

    // get list
    let resultList: RequestResult =
      JSON.parse(readFileSync(path.join(__dirname, '../resources/json/participant/participantRegistrationList.json')).toString());
    // Check if filter needs to be applied
    let statusFilter = (body.externalFilterList.statusList !== '') ? body.externalFilterList.statusList.split(',') : [];
    if (statusFilter.length > 0) {
      resultList.data.rows = resultList.data.rows.filter((item: any) => statusFilter.includes(item.status.toString()));
    }
    return resultList;
  }

  @Get('participants/participant-detail/:registrationId')
  getParticipantRegistration(@Headers('authorization') authorization: string,
                                 @Param('registrationId', ParseIntPipe) registrationId: number,
                                 @Res() res: Response) {
    console.log('Twinning/api/TMS/PAX/participants/participant-detail - Authorization: ' + authorization +
      ', registrationId: ' + registrationId);

    createReadStream(path.join(__dirname, '../resources/json/participant/participantRegistration.json')).pipe(res);
  }

  @Post('event/change-eventReg-details')
  changeEventRegDetails(@Headers('authorization') authorization: string,
                        @Body() body: any): object {
    console.log('Twinning/api/TMS/PAX/event/change-eventReg-details - Authorization: ' + authorization +
      ', body: ' + JSON.stringify(body));

    return body;
  }

  @Get('inviters/event-beneficiary-countries/:eventId/:eventInviterId')
  getEventBeneficiaryCountryList(@Headers('authorization') authorization: string,
                                 @Param('eventId', ParseIntPipe) eventId: number,
                                 @Param('eventInviterId', ParseIntPipe) eventInviterId: number,
                                 @Res() res: Response) {
    console.log('Twinning/api/TMS/PAX/inviters/event-beneficiary-countries - Authorization: ' + authorization +
      ', eventId: ' + eventId + ', eventInviterId: ' + eventInviterId);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/participant/eventBeneficiaryCountries.json')).pipe(res);
  }

  @Get('event/event-detail/:eventId')
  getEventDetail(@Headers('authorization') authorization: string,
                 @Param('eventId', ParseIntPipe) eventId: number,
                 @Res() res: Response) {
    console.log('Twinning/api/TMS/PAX/event/event-detail - Authorization: ' + authorization +
      ', eventId: ' + eventId);

    createReadStream(path.join(__dirname, '../resources/json/participant/partEventDetail.json')).pipe(res);
  }

  @Post('participants/approve-registration-list')
  approveRegistrationList(@Headers('authorization') authorization: string,
                          @Body() body: Array<number>): Array<any> {
    console.log('Twinning/api/TMS/PAX/participants/approve-registration-list - Authorization: ' + authorization + ', body: ' + JSON.stringify(body));

    // get list and extract selected id - test data
    let participantList: Array<any> =
      JSON.parse(readFileSync(path.join(__dirname, '../resources/json/participant/participantRegistrationList.json')).toString()).rows;
    let updatedParticipantList: Array<any> = [];
    participantList.forEach(item => {
      if (body.includes(item.registrationId) === true) {
        item.status = 16;
        updatedParticipantList.push(item);
      }
    });

    return updatedParticipantList;
  }

  @Post('participants/set-participant')
  setParticipantRegistration(@Headers('authorization') authorization: string,
                             @Body() body: any,
                             @Res() res: Response) {
    console.log('Twinning/api/TMS/PAX/participants/set-participant - Authorization: ' + authorization +
      ', body: ' + JSON.stringify(body));

    createReadStream(path.join(__dirname, '../resources/json/participant/setParticipant.json')).pipe(res);
  }

  @Get('participants/refuse-registration-list/:selectedParticipantId/:comment')
  refuseRegistrationList(@Headers('authorization') authorization: string,
                         @Param('selectedParticipantId', ParseIntPipe) selectedParticipantId: number,
                         @Param('comment') comment: string,
                         @Res() res: Response) {
    console.log('Twinning/api/TMS/PAX/participants/refuse-registration-list - Authorization: ' + authorization +
      ', selectedParticipantId: ' + selectedParticipantId + ', comment: ' + comment);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/participant/refuseRegistrationList.json')).pipe(res);
  }

  @Get('participants/workflow-logistic-finish/:eventId')
  @Header('Content-Type', 'text/plain')
  workflowLogisticFinish(@Headers('authorization') authorization: string,
                         @Param('eventId', ParseIntPipe) eventId: number): boolean {
    console.log('Twinning/api/TMS/PAX/participants/workflow-logistic-finish - Authorization: ' + authorization +
      ', eventId: ' + eventId);

    return false;
  }

  @Post('participants/my-registration-list')
  getMyRegistrationList(@Headers('authorization') authorization: string,
                        @Body() body: any): ResultList {
    console.log('Twinning/api/TMS/PAX/participants/my-registration-list - Authorization: ' + authorization +
      ', body: ' + JSON.stringify(body));

    // get list
    let resultList: ResultList =
      JSON.parse(readFileSync(path.join(__dirname, '../resources/json/participant/myRegistrationList.json')).toString());
    // Check if filter needs to be applied
    let statusFilter = (body.externalFilterList.statusList !== '') ? body.externalFilterList.statusList.split(',') : [];
    if (statusFilter.length > 0) {
      resultList.rows = resultList.rows.filter((item: any) => statusFilter.includes(item.status.toString()));
    }
    return resultList;
  }

  @Get('participants/delete-participant/:registrationId')
  deleteRegistration(@Headers('authorization') authorization: string,
                     @Param('registrationId') registrationId: number): boolean {
    console.log('Twinning/api/TMS/PAX/participants/delete-participant - registrationId: ' + registrationId);

    return true;
  }

  @Post('participants/add-participant-registration')
  addParticipantRegistration(@Headers('authorization') authorization: string,
                             @Body() body: any,
                             @Res() res: Response) {
    console.log('Twinning/api/TMS/PAX/participants/add-participant-registration - Authorization: ' + authorization +
      ', body: ' + JSON.stringify(body));

    createReadStream(path.join(__dirname, '../resources/json/participant/addParticipantRegistration.json')).pipe(res);
  }

  @Post('participants/import-registration-list/:eventId')
  importRegistrationList(@Headers('authorization') authorization: string,
                         @Param('eventId') eventId: number,
                         @Body() body: any): object {
    console.log('Twinning/api/TMS/PAX/participants/import-registration-list - Authorization: ' + authorization + ', eventId: ' + eventId +
      ', Body: ' + JSON.stringify(body));

    const data = {
      'result': true,
      'message': null,
      'messageType': 1
    };

    return data;
  }

  @Post('participants/import-registration-list/:eventId/:eventInviterId')
  importRegistrationForInviterList(@Headers('authorization') authorization: string,
                                   @Param('eventId') eventId: number,
                                   @Param('eventInviterId') eventInviterId: number,
                                   @Body() body: any): object {
    console.log('Twinning/api/TMS/PAX/participants/import-registration-list - Authorization: ' + authorization + ', eventId: ' + eventId +
      ', eventInviterId: ' + eventInviterId + ', Body: ' + JSON.stringify(body));

    const data = {
      'result': true,
      'message': null,
      'messageType': 1
    };

    return data;
  }

  @Get('participants/event-inviter-countries')
  getEventInviterCountryList(@Headers('authorization') authorization: string,
                             @Res() res: Response) {
    console.log('TMSWebRestrict/api/PAX/participants/details/event-inviter-countries - Authorization: ' + authorization);

    createReadStream(path.join(__dirname, '../resources/json/pax/event_inviter_country_List_4.json')).pipe(res);
  }

  @Get('participants/event-inviter-countries/:eventInviterId')
  getEventInviterCountryForInviterList(@Headers('authorization') authorization: string,
                                       @Param('eventInviterId') eventInviterId: number,
                                       @Res() res: Response) {
    console.log('TMSWebRestrict/api/PAX/participants/details/event-inviter-countries - Authorization: ' + authorization +
      ', eventInviterId: ' + eventInviterId);

    createReadStream(path.join(__dirname, '../resources/json/pax/event_inviter_country_List_4.json')).pipe(res);
  }

  @Post('participants/my-registration-participants-list')
  getParticipantPersonList(@Headers('authorization') authorization: string,
                           @Body() body: any,
                           @Res() res: Response) {
    console.log('Twinning/api/TMS/PAX/participants/my-registration-participants-list - Authorization: ' + authorization +
      ', body: ' + JSON.stringify(body));

    createReadStream(path.join(__dirname, '../resources/json/participant/myRegistrationParticipantsList.json')).pipe(res);
  }
}
