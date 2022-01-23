import { Body, Controller, Get, Headers, Param, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { createReadStream } from 'fs';
import * as path from 'path';

@Controller('Twinning/api/TMS/eventMaterial')
export class EventMaterialController {
  @Get('labels/:eventId')
  getParticipants(@Headers('authorization') authorization: string,
                  @Param('eventId') eventId: number,
                  @Res() res: Response) {
    console.log('Twinning/api/TMS/eventMaterial/labels - Authorization: ' + authorization + ', eventId: ' + eventId);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/eventMaterial/materialParticipantList.json')).pipe(res);
  }

  @Post('extract-labels')
  extractLabels(@Headers('authorization') authorization: string,
                @Body() body: any,
                @Res() res: Response) {
    console.log('Twinning/api/TMS/eventMaterial/extract-labels - Authorization: ' + authorization +
      ', Body: ' + JSON.stringify(body));
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/eventMaterial/extractLabels.json')).pipe(res);
  }

  @Get('countryChevalet/:eventId')
  getCountryList(@Headers('authorization') authorization: string,
                 @Param('eventId') eventId: number,
                 @Res() res: Response) {
    console.log('Twinning/api/TMS/eventMaterial/countryChevalet - Authorization: ' + authorization + ', eventId: ' + eventId);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/eventMaterial/countryChevaletCountryList.json')).pipe(res);
  }

  @Post('extract-countryChevalet')
  extractCountryChevalets(@Headers('authorization') authorization: string,
                          @Body() body: any,
                          @Res() res: Response) {
    console.log('Twinning/api/TMS/eventMaterial/extract-countryChevalet - Authorization: ' + authorization +
      ', Body: ' + JSON.stringify(body));
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/eventMaterial/extractCountryChevalet.json')).pipe(res);
  }
}
