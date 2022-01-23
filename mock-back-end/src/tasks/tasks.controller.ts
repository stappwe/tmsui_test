import { Controller, Get, Headers, Post, Res, Body, Param, HttpCode, HttpStatus, Header, Query } from '@nestjs/common';

import { Response } from 'express';
import { createReadStream } from 'fs';
import * as path from 'path';
import { GeneralRoutines } from '../common/generalRoutines';

@Controller('Twinning/api/TMS')
export class TasksController {
  @Post('tasks/list')
  getTasks(@Headers('authorization') authorization: string,
           @Body() sortFilters: any,
           @Res() res: Response) {
    console.log('Twinning/api/TMS/tasks/list - Authorization: ' + authorization + ', sortFilters: ' + JSON.stringify(sortFilters));
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/tasks/taskList.json')).pipe(res);
  }

  @Post('requests/list')
  getImportRequests(@Headers('authorization') authorization: string,
                    @Body() sortFilters: any,
                    @Res() res: Response) {
    console.log('Twinning/api/TMS/requests/list - Authorization: ' + authorization + ', sortFilters: ' + JSON.stringify(sortFilters));
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/tasks/importRequests.json')).pipe(res);
  }

  @Get('requests/:requestId')
  deleteRequest(@Headers('authorization') authorization: string,
                 @Param('requestId') requestId: number): boolean {
    console.log('Twinning/api/TMS/forecast/requests - Authorization: ' + authorization + ', requestId: ' + requestId);
    // Extract payload
    // let jwt = new JWT(authorization);

    return true;
  }

  @Get('taskslist-print')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  @Header('Content-Disposition', 'attachment; filename=tasksList.xlsx')
  extractTasks(@Headers('authorization') authorization: string,
               @Query('filters') filters: string,
               @Res() res: Response) {
    console.log('Twinning/api/TMS/taskslist-print - Authorization: ' + authorization + ', filters: ' + filters);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/tasks/tasksList.xlsx')).pipe(res);
  }

  @Get('import-request-print')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  @Header('Content-Disposition', 'attachment; filename=importRequests.xlsx')
  extractImportRequests(@Headers('authorization') authorization: string,
                        @Query('filters') filters: string,
                        @Res() res: Response) {
    console.log('Twinning/api/TMS/import-request-print - Authorization: ' + authorization + ', filters: ' + filters);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/tasks/importRequests.xlsx')).pipe(res);
  }

  @Get('requests/import/:requestId')
  importRequest(@Headers('authorization') authorization: string,
                              @Param('requestId') requestId: number,
                              @Res() res: Response) {
    console.log('Twinning/api/TMS/financial/invoice/invoice-budgetary-listBox - Authorization: ' + authorization +
      ', requestId: ' + requestId
    );
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/tasks/importRequestResult.json')).pipe(res);
  }

  @Get('tasks/cancel-activate-task/:taskId/:cancelled')
  cancelActivateTask(@Headers('authorization') authorization: string,
                     @Param('taskId') taskId: number,
                     @Param('cancelled') cancelled: string,
                     @Res() res: Response) {
    console.log('Twinning/api/TMS/tasks/cancel-activate-task - Authorization: ' + authorization +
      ', taskId: ' + taskId + ', cancelled: ' + cancelled);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/tasks/cancelActivateTask.json')).pipe(res);
  }
}
