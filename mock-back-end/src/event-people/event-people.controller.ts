import { Body, Controller, Get, Headers, Param, Post, Res } from '@nestjs/common';

import { Response } from 'express';
import { createReadStream } from 'fs';
import * as path from 'path';

@Controller('Twinning/api/TMS/events/event')
export class EventPeopleController {
  @Get('people-list/:eventId')
  getPeopleList(@Headers('authorization') authorization: string,
                @Param('eventId') eventId: number,
                @Res() res: Response) {
    console.log('Twinning/api/TMS/events/event/people-list - Authorization: ' + authorization + ', eventId: ' + eventId);

    createReadStream(path.join(__dirname, '../resources/json/events/event/people-list.json')).pipe(res);
  }

  @Get('delete-participant/:participantToken')
  deleteParticipant(@Headers('authorization') authorization: string,
                    @Param('participantToken') participantToken: string,
                    @Res() res: Response) {
    console.log('Twinning/api/TMS/events/event/delete-participant - Authorization: ' + authorization + ', participantToken: ' + participantToken);

    createReadStream(path.join(__dirname, '../resources/json/events/event/delete-participant.json')).pipe(res);
  }

  @Post('add-participant-list')
  getParticipantPersonList(@Headers('authorization') authorization: string,
                           @Body() body: any,
                           @Res() res: Response) {
    console.log('Twinning/api/TMS/events/event/add-participant-list - Authorization: ' + authorization + ', body: ' + JSON.stringify(body));

    createReadStream(path.join(__dirname, '../resources/json/events/event/add-participant-list.json')).pipe(res);
  }

  @Get('add-participant/:eventId/:personId')
  addParticipant(@Headers('authorization') authorization: string,
                 @Param('eventId') eventId: number,
                 @Param('peInId') peInId: number,
                 @Param('jobTitleId') jobTitleId: number,
                 @Res() res: Response) {
    console.log('Twinning/api/TMS/events/event/delete-participant - Authorization: ' + authorization + ', eventId: ' + eventId +
      ', peInId: ' + peInId + ', jobTitleId: ' + jobTitleId);

    createReadStream(path.join(__dirname, '../resources/json/events/event/add-participant.json')).pipe(res);
  }

  @Get('update-job-title-participant/:participantToken/:jobTitleId')
  updateJobTitleParticipant(@Headers('authorization') authorization: string,
                            @Param('participantToken') participantToken: string,
                            @Param('jobTitleId') jobTitleId: number,
                            @Res() res: Response) {
    console.log('Twinning/api/TMS/events/event/update-job-title-participant - Authorization: ' + authorization + ', participantToken: ' + participantToken +
      ', jobTitleId: ' + jobTitleId);

    createReadStream(path.join(__dirname, '../resources/json/events/event/update-job-title-participant.json')).pipe(res);
  }

  @Post('update-travel-accom-comment-participant')
  updateTravelCommentParticipant(@Headers('authorization') authorization: string,
                                 @Body() body: any,
                                 @Res() res: Response) {
    console.log('Twinning/api/TMS/events/event/update-travel-accom-comment-participant - Authorization: ' + authorization +
      ', body: ' + JSON.stringify(body));

    createReadStream(path.join(__dirname, '../resources/json/events/event/update-travel-accom-comment-participant.json')).pipe(res);
  }

  @Post('update-checkout-status-participant')
  updateCheckoutStatusParticipant(@Headers('authorization') authorization: string,
                                  @Body() body: any,
                                  @Res() res: Response) {
    console.log('Twinning/api/TMS/events/event/update-checkout-status-participant - Authorization: ' + authorization + ', body: ' + JSON.stringify(body));

    createReadStream(path.join(__dirname, '../resources/json/events/event/update-checkout-status-participant.json')).pipe(res);
  }

  @Post('cancel-participation-list')
  cancelParticipationList(@Headers('authorization') authorization: string,
                          @Body() eventId: number,
                          @Res() res: Response) {
    console.log('Twinning/api/TMS/events/event/cancel-participation-list - Authorization: ' + authorization + ', eventId: ' + eventId);

    createReadStream(path.join(__dirname, '../resources/json/events/event/cancel-participation-list.json')).pipe(res);
  }

  @Get('cancel-participation/:eventId/:participantId/:cancellationOptions/:reintroducePerson')
  cancelParticipation(@Headers('authorization') authorization: string,
                      @Param('eventId') eventId: number,
                      @Param('participantId') participantId: number,
                      @Param('cancellationOptions') cancellationOptions: number,
                      @Param('reintroducePerson') reintroducePerson: boolean,
                      @Res() res: Response) {
    console.log('Twinning/api/TMS/events/event/cancel-participation - Authorization: ' + authorization + ', eventId: ' + eventId +
      ', participantId: ' + participantId + ', cancellationOptions: ' + cancellationOptions + ', reintroducePerson: ' + reintroducePerson);

    createReadStream(path.join(__dirname, '../resources/json/events/event/cancel-participation.json')).pipe(res);
  }
}
