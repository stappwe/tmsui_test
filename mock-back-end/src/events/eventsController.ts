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
  Query,
  Res
} from '@nestjs/common';

import { Response } from 'express';
import { createReadStream } from 'fs';
import * as path from 'path';

export enum enFolderStatus {
  lock = 1,
  unlock = 2
}

@Controller('Twinning/api/TMS/events')
export class EventsController {
  @Get('detail/:eventId')
  getEventDetails(@Headers('authorization') authorization: string,
                  @Param('eventId') eventId: number,
                  @Res() res: Response) {
    console.log('Twinning/api/TMS/events/detail - Authorization: ' + authorization + ', eventId: ' + eventId);

    createReadStream(path.join(__dirname, '../resources/json/events/event_' + eventId + '.json')).pipe(res);
  }

  @Post('update/:eventId')
  setEventDetails(@Headers('authorization') authorization: string,
                  @Param('eventId') eventId: string,
                  @Body() body: any,
                  @Res() res: Response) {
    console.log('Twinning/api/TMS/events/update - Authorization: ' + authorization + ', eventId: ' + eventId + ', Body: ' + JSON.stringify(body));

    let id = (eventId === 'null') ? 80304 : eventId;
    createReadStream(path.join(__dirname, '../resources/json/events/insertUpdateEvent_' + id + '.json')).pipe(res);
  }

  @Get('conference-facility-options')
  getConferenceFacilityOptions(@Headers('authorization') authorization: string, @Res() res: Response): void {
    console.log('Twinning/api/TMS/events/conference-facility-options - Authorization: ' + authorization);

    createReadStream(path.join(__dirname, '../resources/json/events/conference-facility-options.json')).pipe(res);
  }

  @Get('allowed-workflow-actions/:userRoleId/:eventId')
  getAllowedWorkflowActions(@Headers('authorization') authorization: string,
                            @Param('userRoleId') userRoleId: number,
                            @Param('eventId') eventId: number): Array<number> {
    console.log('Twinning/api/TMS/events/allowed-workflow-actions - Authorization: ' + authorization +
      ', userRoleId: ' + userRoleId + ', eventId: ' + eventId);

    // CCH = LO_F
    // IBU_CH = []
    return [24];
  }

  @Get('authorisation/detail/:eventId')
  getAuthorisationFormDetail(@Headers('authorization') authorization: string,
                             @Param('eventId') eventId: number,
                             @Res() res: Response) {
    console.log('Twinning/api/TMS/events/authorisation/detail - Authorization: ' + authorization + ', eventId: ' + eventId);

    createReadStream(path.join(__dirname, '../resources/json/events/authorisationForm_' + eventId + '.json')).pipe(res);
  }

  @Post('authorisation/update/:eventId')
  setAuthorisationFormDetail(@Headers('authorization') authorization: string,
                             @Param('eventId') eventId: number,
                             @Body() body: any,
                             @Res() res: Response) {
    console.log('Twinning/api/TMS/events/authorisation/update - Authorization: ' + authorization + ', eventId: ' + eventId +
      ', Body: ' + JSON.stringify(body));

    createReadStream(path.join(__dirname, '../resources/json/events/updateAuthorisationForm_' + body.eventId + '.json')).pipe(res);
  }

  @Post('person-list/participants')
  getPersonList(@Headers('authorization') authorization: string,
                @Body() body: any,
                @Res() res: Response) {
    console.log('Twinning/api/TMS/events/person-list/participants - Authorization: ' + authorization + ', Body: ' + JSON.stringify(body));

    createReadStream(path.join(__dirname, '../resources/json/events/participant-person-list.json')).pipe(res);
  }

  @Get('event-date-changes/:eventId')
  getEventDateChanges(@Headers('authorization') authorization: string,
                      @Param('eventId') eventId: number,
                      @Res() res: Response): void {
    console.log('Twinning/api/TMS/events/event-date-changes - Authorization: ' + authorization + ', eventId: ' + eventId);

    createReadStream(path.join(__dirname, '../resources/json/events/event-date-changes.json')).pipe(res);
  }

  @Get('beneficiary-countries')
  getBeneficiaryCountryList(@Headers('authorization') authorization: string,
                            @Query('taiexContractorId') taiexContractorId: number,
                            @Query('eventId') eventId: number,
                            @Res() res: Response) {
    console.log('Twinning/api/TMS/events/beneficiary-countries - Authorization: ' + authorization + ', taiexContractorId: ' + taiexContractorId +
      ', eventId: ' + eventId);

    if (taiexContractorId) {
      createReadStream(path.join(__dirname, '../resources/json/events/beneficiaryCountryList_' + taiexContractorId + '.json')).pipe(res);
    } else {
      createReadStream(path.join(__dirname, '../resources/json/events/beneficiaryCountryList_8.json')).pipe(res);
    }
  }

  @Get('budget-available/:eventId')
  isBudgetAvailable(@Headers('authorization') authorization: string,
                    @Param('eventId') eventId: number,
                    @Res() res: Response) {
    console.log('Twinning/api/TMS/events/budget-available - Authorization: ' + authorization + ', eventId: ' + eventId);

    createReadStream(path.join(__dirname, '../resources/json/events/isBudgetAvailable.json')).pipe(res);
  }

  @Get('update-web-folder-status/:motherEventId/:folderStatus')
  UpdateWebFolderStatus(@Headers('authorization') authorization: string,
                        @Param('motherEventId') motherEventId: number,
                        @Param('folderStatus') folderStatus: enFolderStatus,
                        @Res() res: Response) {
    console.log('Twinning/api/TMS/events/update-web-folder-status - Authorization: ' + authorization + ', motherEventId: ' + motherEventId +
      ', folderStatus: ' + folderStatus);

    createReadStream(path.join(__dirname, '../resources/json/events/updateWebFolderStatus.json')).pipe(res);
  }

  @Get('event-place-countries')
  getEventPlaceCountryList(@Headers('authorization') authorization: string, @Res() res: Response) {
    console.log('Twinning/api/TMS/events/event-place-countries - Authorization: ' + authorization);

    createReadStream(path.join(__dirname, '../resources/json/events/eventPlaceCountries.json')).pipe(res);
  }

  @Post('check-for-multiple-events')
  checkForMultipleEvents(@Headers('authorization') authorization: string,
                         @Body() body: any,
                         @Res() res: Response) {
    console.log('Twinning/api/TMS/events/check-for-multiple-events - Authorization: ' + authorization + ', Body: ' + JSON.stringify(body));

    createReadStream(path.join(__dirname, '../resources/json/events/checkForMultipleEvents.json')).pipe(res);
  }

  @Post('event/send-draft-email/:eventId')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/x-msg')
  @Header('Content-Disposition', 'attachment; filename=Send_Draft_Email.msg')
  sendDraftEmail(@Headers('authorization') authorization: string,
                 @Param('eventId') eventId: number,
                 @Query('participantTokens') participantTokens: Array<number>,
                 @Res() res: Response) {
    console.log('Twinning/api/TMS/events/event/send-draft-email - Authorization: ' + authorization +
      ', eventId:' + eventId + ', participantTokens: ' + JSON.stringify(participantTokens));

    createReadStream(path.join(__dirname, '../resources/eventDocument/Send_Draft_Email.msg')).pipe(res);
  }

  @Get('catering-types')
  getCateringTypes(@Headers('authorization') authorization: string, @Res() res: Response) {
    console.log('Twinning/api/TMS/events/catering-types - Authorization: ' + authorization);

    createReadStream(path.join(__dirname, '../resources/json/events/cateringTypes.json')).pipe(res);
  }
}
