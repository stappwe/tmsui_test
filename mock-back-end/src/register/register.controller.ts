/* tslint:disable:max-line-length */
import { Body, Controller, Get, Headers, Param, Post, Res } from '@nestjs/common';

import { Response } from 'express';
import { createReadStream } from 'fs';
import * as path from 'path';

@Controller('Twinning/api/register')
export class RegisterController {
  @Post('user-request-access')
  userRequestAccess(@Headers('authorization') authorization: string, @Body() body: any): object {
    console.log('Twinning/api/register/user-request-access - Authorization: ' + authorization + ', Body: ' + JSON.stringify(body));

    const data = {
      'result': true,
      'message': 'Successfully saved',
      'messageType': 1,
      'data': {
        'pageContent': 'Your request to access the application has successfully been submitted. You will be contact ASAP by the person in charge. Thanks for your collaboration.'
      }
    };

    return data;
  }

  @Get('user-category-list/:application')
  getUserCategoryList(@Headers('authorization') authorization: string,
                      @Param('application') application: string,
                      @Res() res: Response) {
    console.log('Twinning/api/register/user-category-list - Authorization: ' + authorization + ', application: ' + application);

    createReadStream(path.join(__dirname, '../resources/json/register/userCategoryList_' + application + '.json')).pipe(res);
  }

  @Get('application-list')
  getApplicationList(@Headers('authorization') authorization: string, @Res() res: Response) {
    console.log('Twinning/api/register/application-list - Authorization: ' + authorization);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/register/applicationList.json')).pipe(res);
  }
}
