import { Body, Controller, Get, Header, Headers, HttpCode, HttpStatus, Param, Post, Res } from '@nestjs/common';

import { Response } from 'express';
import { createReadStream } from 'fs';
import * as path from 'path';

import { JWT } from '../common/generalRoutines';

@Controller('TMSWebRestrict/api/evaluation')
export class EvaluationController {
  @Get('getForm')
  getForm(@Headers('authorization') authorization: string,
          @Res() res: Response) {
    // Extract payload
    const jwt = new JWT(authorization);
    console.log('TMSWebRestrict/api/evaluation/getForm - Authorization: ' + authorization + ', evalSysPartId: ' + jwt.payLoad.evalSysPartId);
    const filename = '../resources/json/evaluation/evaluationForm_' + jwt.payLoad.evalSysPartId + '.json';

    createReadStream(path.join(__dirname, filename)).pipe(res);
  }

  @Post('setForm')
  setForm(@Headers('authorization') authorization: string,
          @Body() body: any,
          @Res() res: Response) {
    console.log('Twinning/api/evaluation/setForm - Authorization: ' + authorization +
      ', Body: ' + JSON.stringify(body));

    createReadStream(path.join(__dirname, '../resources/json/evaluation/setForm.json')).pipe(res);
  }
}
