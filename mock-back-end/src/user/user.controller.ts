/* tslint:disable:max-line-length */
import { Body, Controller, Get, Headers, Param, Res, Post } from '@nestjs/common';

import { Response } from 'express';
import { createReadStream } from 'fs';
import * as path from 'path';

@Controller('Twinning/api/user')
export class UserController {
  @Get('profile')
  getUserProfile(@Headers('authorization') authorization: string, @Res() res: Response) {
    console.log('Twinning/api/user/profile - Authorization: ' + authorization);

    // Registered full access user:
    createReadStream(path.join(__dirname, '../resources/json/user/userProfile.json')).pipe(res);
    // Registered Read only user:
    // createReadStream(path.join(__dirname, '../resources/json/user/userProfile_Read_Only.json')).pipe(res);
    // Inactive user:
    // createReadStream(path.join(__dirname, '../resources/json/user/userProfile_in_active.json')).pipe(res);
    // Not registered user:
    // createReadStream(path.join(__dirname, '../resources/json/user/userProfileNotRegistered.json')).pipe(res);
  }

  @Get('user-category-list/:application')
  getUserCategoryList(@Headers('authorization') authorization: string,
                      @Param('application') application: string,
                      @Res() res: Response) {
    console.log('Twinning/api/user/user-category-list - Authorization: ' + authorization + ', application: ' + application);

    createReadStream(path.join(__dirname, '../resources/json/user/userCategoryList_' + application + '.json')).pipe(res);
  }
}
