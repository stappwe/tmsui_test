import { Controller, Get, Header, Headers, HttpCode, HttpStatus, Query, Res, Param, ParseIntPipe } from '@nestjs/common';

import { Response } from 'express';
import { createReadStream } from 'fs';
import * as path from 'path';

@Controller('TMSWebRestrict/api/report')
export class ReportController {
  @Get('informNationalContactList')
  getInformNationalContactList(@Headers('authorization') authorization: string, @Res() res: Response) {
    console.log('report/informNationalContactList - Authorization: ' + authorization);

    createReadStream(path.join(__dirname, '../resources/json/report/informNationalContactList.json')).pipe(res);
  }

  @Get('informNationalContactDetail')
  getInformNationalContactDetail(@Headers('authorization') authorization: string, @Res() res: Response) {
    console.log('report/informNationalContactDetail - Authorization: ' + authorization);

    createReadStream(path.join(__dirname, '../resources/json/report/informNationalContactDetail.json')).pipe(res);
  }

  @Get('extractInformNationalContactList/:userToken')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  @Header('Content-Disposition', 'attachment; filename=informNationalContact_70589.xlsx')
  ExtractInformNationalContactList(@Param('userToken') userToken: string, @Res() res: Response) {
    console.log('report/extractInformNationalContactList - userToken: ' + userToken);

    createReadStream(path.join(__dirname, '../resources/report/extractInformNationalContactList.xlsx')).pipe(res);
  }

  @Get('sendReportList')
  getSendReportList(@Headers('authorization') authorization: string, @Res() res: Response) {
    console.log('report/sendReportList - Authorization: ' + authorization);

    createReadStream(path.join(__dirname, '../resources/json/report/sendReportList.json')).pipe(res);
  }

  @Get('sendReportDetail')
  getSendReportDetail(@Headers('authorization') authorization: string, @Res() res: Response) {
    console.log('report/sendReportDetail - Authorization: ' + authorization);

    createReadStream(path.join(__dirname, '../resources/json/report/sendReportDetail.json')).pipe(res);
  }

  @Get('extractSendReportList/:userToken')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  @Header('Content-Disposition', 'attachment; filename=sendReport_70589.xlsx')
  ExtractSendReportList(@Param('userToken') userToken: string, @Res() res: Response) {
    console.log('report/extractSendReportList - userToken: ' + userToken);

    createReadStream(path.join(__dirname, '../resources/report/extractSendReportList.xlsx')).pipe(res);
  }

  @Get('sendReportExtract/:userToken/:documentId')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  @Header('Content-Disposition', 'attachment; filename=report_x.xlsx')
  sendReportExtract(@Param('userToken') userToken: string,
                    @Param('documentId', ParseIntPipe) documentId: number,
                    @Res() res: Response) {
    console.log('report/sendReportExtract - userToken: ' + userToken + ', documentId: ' + documentId);

    createReadStream(path.join(__dirname, '../resources/report/report_x.xlsx')).pipe(res);
  }
}
