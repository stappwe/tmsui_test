import { Body, Controller, Get, Headers, Param, Post, Res } from '@nestjs/common';

import { Response } from 'express';
import { createReadStream } from 'fs';
import * as path from 'path';

@Controller('Twinning/api/TMS/event/expert')
export class EventExpertController {
  @Post('registration-list/:eventId')
  getExpertRegistrationList(@Headers('authorization') authorization: string,
                            @Param('eventId') eventId: number,
                            @Body() body: any,
                            @Res() res: Response): void {
    console.log('Twinning/api/TMS/event/expert/registration-list - eventId: ' + eventId);

    createReadStream(path.join(__dirname, '../resources/json/events/event/expert/registrationList.json')).pipe(res);
  }

  @Get('delete/:registrationId')
  deleteExpertRegistration(@Headers('authorization') authorization: string,
                           @Param('registrationId') registrationId: number,
                           @Res() res: Response): void {
    console.log('Twinning/api/TMS/event/expert/delete - registrationId: ' + registrationId);

    createReadStream(path.join(__dirname, '../resources/json/events/event/expert/deleteExpertRegistration.json')).pipe(res);
  }

  @Get('reopen/:registrationId')
  reopenExpertRegistration(@Headers('authorization') authorization: string,
                           @Param('registrationId') registrationId: number,
                           @Res() res: Response): void {
    console.log('Twinning/api/TMS/event/expert/reopen - registrationId: ' + registrationId);

    createReadStream(path.join(__dirname, '../resources/json/events/event/expert/reopenExpertRegistration.json')).pipe(res);
  }

  @Post('registration-person-list')
  getExpertPersonList(@Headers('authorization') authorization: string,
                      @Body() body: any,
                      @Res() res: Response): void {
    console.log('Twinning/api/TMS/event/expert/registration-person-list');

    createReadStream(path.join(__dirname, '../resources/json/events/event/expert/registrationPersonList.json')).pipe(res);
  }

  @Post('add-registration')
  addExpertRegistration(@Headers('authorization') authorization: string,
                        @Body() body: any,
                        @Res() res: Response) {
    console.log('Twinning/api/TMS/event/expert/add-registration - Authorization: ' + authorization + ', body: ' + JSON.stringify(body));

    createReadStream(path.join(__dirname, '../resources/json/events/event/expert/addExpertRegistration.json')).pipe(res);
  }
}
