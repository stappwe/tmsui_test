import { Controller, Get, Headers, Res } from '@nestjs/common';

import { Response } from 'express';
import { createReadStream } from 'fs';
import * as path from 'path';

@Controller('Twinning/api')
export class GeneralController {
  @Get('generalCountryList')
  getApplicationList(@Headers('authorization') authorization: string, @Res() res: Response) {
    console.log('Twinning/api/generalCountryList - Authorization: ' + authorization);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/general/generalCountryList.json')).pipe(res);
  }

  @Get('cityCountryList')
  getCityCountryList(@Headers('authorization') authorization: string, @Res() res: Response) {
    console.log('Twinning/api/cityCountryList - Authorization: ' + authorization);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/general/generalCountryList.json')).pipe(res);
  }

  @Get('allpersoncategories')
  getPersonCategories(@Headers('authorization') authorization: string, @Res() res: Response) {
    console.log('Twinning/api/allpersoncategories - Authorization: ' + authorization);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/general/personcategories.json')).pipe(res);
  }
}
