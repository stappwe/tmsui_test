/* tslint:disable:max-line-length */
import { Body, Controller, Get, Header, Headers, HttpCode, HttpStatus, Param, Post, Query, Res } from '@nestjs/common';

import { Response } from 'express';
import { createReadStream } from 'fs';
import * as path from 'path';

@Controller('Twinning/api/TMS')
export class FinancialController {
  @Get('forecast/list-budget-team')
  getForecastTeams(@Headers('authorization') authorization: string,
                   @Res() res: Response) {
    console.log('Twinning/api/TMS/forecast/list-budget-team - Authorization: ' + authorization);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/financial/forecastteams.json')).pipe(res);
  }

  @Get('forecast/list-budget-line')
  getForecastBudgetlines(@Headers('authorization') authorization: string,
                   @Res() res: Response) {
    console.log('Twinning/api/TMS/forecast/list-budget-line - Authorization: ' + authorization);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/financial/forecastbudgetlines.json')).pipe(res);
  }

  @Get('forecast/list-extract-period/:taiexcontractorId/:teamId/:budgetlineId')
  getForecastPeriods(@Headers('authorization') authorization: string,
                     @Param('taiexcontractorId') taiexcontractorId: number,
                     @Param('teamId') teamId: number,
                         @Param('budgetlineId') budgetlineId: number,
                         @Res() res: Response) {
    console.log('Twinning/api/TMS/forecast/list-extract-period - Authorization: ' + authorization +
      ', taiexcontractorId: ' + taiexcontractorId + ', teamId: ' + teamId + ', budgetlineId: ' + budgetlineId);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/financial/forecastperiods.json')).pipe(res);
  }

  @Get('forecast/list-detail/:taiexcontractorId/:teamId/:budgetlineId/:quarterId')
  getForecastDetails(@Headers('authorization') authorization: string,
                     @Param('taiexcontractorId') taiexcontractorId: number,
                     @Param('teamId') teamId: number,
                     @Param('budgetlineId') budgetlineId: number,
                     @Param('quarterId') quarterId: number,
                     @Res() res: Response) {
    console.log('Twinning/api/TMS/forecast/list-detail - Authorization: ' + authorization +
      ', taiexcontractorId: ' + taiexcontractorId + ', teamId: ' + teamId + ', budgetlineId: ' + budgetlineId +
      ', quarterId: ' + quarterId);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/financial/forecastdetails.json')).pipe(res);
  }

  @Get('forecast/list-unused-quarters/:taiexcontractorId')
  getUnusedForecastQuarters(@Headers('authorization') authorization: string,
                            @Param('taiexcontractorId') taiexcontractorId: number,
                            @Res() res: Response) {
    console.log('Twinning/api/TMS/forecast/list-unused-quarters - Authorization: ' + authorization +
      ', taiexcontractorId: ' + taiexcontractorId);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/financial/unusedforecastquarters.json')).pipe(res);
  }

  @Get('forecast/payment-dashboard')
  getFinancialDashboardUrl(@Headers('authorization') authorization: string): string {
    console.log('Twinning/api/TMS/forecast/payment-dashboard - Authorization: ' + authorization);
    // Extract payload
    // let jwt = new JWT(authorization);

    return 'https://webgate.ec.europa.eu/near_qv/QvAJAXZfc/opendoc.htm?document=Access%20Point%2F1.Application%2FACC%2FTAIEX%2F003_TMS_Dashboard%2F2_Qvw%2F4_AccesPoint%2FTMS_Dashboard.qvw&host=QVS%40NEAR_QLIKVIEW_ext%20&Select=LB_Sheet,TMS&sheet=SH_Financial';
  }

  @Post('forecast/update-forecasts')
  updateForecastDetails(@Headers('authorization') authorization: string,
                        @Body() body: any,
                        @Res() res: Response) {
    console.log('Twinning/api/TMS/forecast/update-forecasts - Authorization: ' + authorization + ', Body: ' + JSON.stringify(body));
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/financial/updateForecasts.json')).pipe(res);
  }

  @Get('forecast/delete-forecasts/:taiexcontractorId/:teamId/:budgetlineId/:quarterId')
  deleteForecast(@Headers('authorization') authorization: string,
                 @Param('taiexcontractorId') taiexcontractorId: number,
                 @Param('teamId') teamId: number,
                 @Param('budgetlineId') budgetlineId: number,
                 @Param('quarterId') quarterId: number): boolean {
    console.log('Twinning/api/TMS/forecast/delete-forecasts - Authorization: ' + authorization +
      ', taiexcontractorId: ' + taiexcontractorId + ', teamId: ' + teamId + ', budgetlineId: ' + budgetlineId +
      ', quarterId: ' + quarterId);
    // Extract payload
    // let jwt = new JWT(authorization);

    return true;
  }

  @Post('forecast/insert-forecasts/:taiexcontractorId/:quarterId')
  insertForecastDetails(@Headers('authorization') authorization: string,
                        @Param('taiexcontractorId') taiexcontractorId: number,
                        @Param('quarterId') quarterId: number,
                        @Body() body: any): object {
    console.log('Twinning/api/TMS/forecast/insert-forecasts - Authorization: ' + authorization +
      ', taiexcontractorId: ' + taiexcontractorId + ', quarterId: ' + quarterId + ', Body: ' + JSON.stringify(body));
    // Extract payload
    // let jwt = new JWT(authorization);

    return {};
  }

  @Get('forecast/print-report/:taiexContractorId/:budgetTeamId/:nbrBudgetLines/:periodExtracted/:printoutFile')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  @Header('Content-Disposition', 'attachment; filename=Forecast_IBF - 7_AGR_Q2.xlsx')
  mailingSurvey(@Headers('authorization') authorization: string,
                @Param('taiexContractorId') taiexContractorId: number,
                @Param('budgetTeamId') budgetTeamId: number,
                @Param('nbrBudgetLines') nbrBudgetLines: number,
                @Param('quarterId') quarterId: number,
                @Param('printoutFile') printoutFile: string,
                @Res() res: Response) {
    console.log('Twinning/api/TMS/forecast/print-report - Authorization: ' + authorization +
      ', taiexContractorId: ' + taiexContractorId + ', budgetTeamId: ' + budgetTeamId +
      ', nbrBudgetLines: ' + nbrBudgetLines + ', quarterId: ' + quarterId + ', printoutFile: ' + printoutFile);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/financial/Forecast_IBF - 7_AGR_Q2.xlsx')).pipe(res);
  }

  @Get('financial/budgetContract/budget-contract-list/:taiexcontractorId')
  getBudgetContracts(@Headers('authorization') authorization: string,
                     @Param('taiexcontractorId') taiexcontractorId: number,
                     @Res() res: Response) {
    console.log('Twinning/api/TMS/financial/budgetContract/budget-contract-list - Authorization: ' + authorization +
      ', taiexcontractorId: ' + taiexcontractorId);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/financial/budget-contract-list.json')).pipe(res);
  }

  @Get('financial/budgetContract/budget-contractor-list')
  getBudgetContractorList(@Headers('authorization') authorization: string, @Res() res: Response) {
    console.log('Twinning/api/TMS/financial/budgetContract/budget-contractor-list - Authorization: ' + authorization);

    createReadStream(path.join(__dirname, '../resources/json/financial/budget-contractor-list.json')).pipe(res);
  }

  @Get('financial/budgetContract/budget-contract-delete/:budgetContractId')
  deleteBudgetContract(@Headers('authorization') authorization: string,
                     @Param('budgetContractId') budgetContractId: number): boolean {
    console.log('Twinning/api/TMS/financial/budgetContract/budget-contract-delete - Authorization: ' + authorization +
      ', budgetContractId: ' + budgetContractId);
    // Extract payload
    // let jwt = new JWT(authorization);

    return true;
  }

  @Get('budget-contract-print/:taiexcontractorId')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  @Header('Content-Disposition', 'attachment; filename=BudgetContract_Extract.xlsx')
  extractBudgetContractData(@Headers('authorization') authorization: string,
                            @Param('taiexcontractorId') taiexcontractorId: string,
                            @Res() res: Response) {
    console.log('Twinning/api/TMS/budget-contract-print/:taiexcontractorId - Authorization: ' + authorization +
      ', taiexcontractorId: ' + taiexcontractorId);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/financial/BudgetContract_Extract.xlsx')).pipe(res);
  }

  @Get('financial/budgetContract/budget-contract-detail/:budgetContractId')
  getBudgetContractDetail(@Headers('authorization') authorization: string,
                          @Param('budgetContractId') budgetContractId: number,
                          @Res() res: Response) {
    console.log('Twinning/api/TMS/financial/budgetContract/budget-contract-detail - Authorization: ' + authorization +
      ', budgetContractId: ' + budgetContractId);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/financial/budget-contract-detail.json')).pipe(res);
  }

  @Post('financial/budgetContract/budget-contract-set')
  setBudgetContract(@Headers('authorization') authorization: string,
                    @Body() body: any,
                    @Res() res: Response) {
    console.log('Twinning/api/TMS/financial/budgetContract/budget-contract-set - Authorization: ' + authorization +
      ', Body: ' + JSON.stringify(body));
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/financial/budget-contract-detail.json')).pipe(res);
  }

  @Get('financial/budgetContract/budget-line-list/:taiexContractorId')
  getBudgetLineList(@Headers('authorization') authorization: string,
                    @Param('taiexContractorId') taiexContractorId: number,
                    @Res() res: Response) {
    console.log('Twinning/api/TMS/financial/budgetContract/budget-line-list - Authorization: ' + authorization +
      ', taiexContractorId: ' + taiexContractorId);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/financial/budget-line-list.json')).pipe(res);
  }

  @Get('financial/invoiceBudgetContract/invoice-budgetPeriod-list')
  getInvoicePeriodList(@Headers('authorization') authorization: string,
                       @Res() res: Response) {
    console.log('Twinning/api/TMS/financial/invoiceBudgetContract/invoice-budgetPeriod-list - Authorization: ' + authorization);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/financial/invoice-budgetPeriod-list.json')).pipe(res);
  }

  @Get('financial/invoice/invoice-supportPeriod-list/:taiexContractorId')
  getInvoiceSupportPeriodList(@Headers('authorization') authorization: string,
                              @Param('taiexContractorId') taiexContractorId: number,
                              @Res() res: Response) {
    console.log('Twinning/api/TMS/financial/invoice/invoice-supportPeriod-list - Authorization: ' + authorization +
      ', taiexContractorId: ' + taiexContractorId);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/financial/invoice-supportPeriod-list.json')).pipe(res);
  }

  @Get('financial/invoiceBudgetContract/invoice-budgetContract-list/:taiexContractorId')
  getInvoiceBudgetContractList(@Headers('authorization') authorization: string,
                               @Param('taiexContractorId') taiexContractorId: number,
                               @Res() res: Response) {
    console.log('Twinning/api/TMS/financial/invoiceBudgetContract/invoice-budgetContract-list - Authorization: ' + authorization +
      ', taiexContractorId: ' + taiexContractorId);
    // Extract payload
    // let jwt = new JWT(authorization);

    const filename = (taiexContractorId === -1)
      ? '../resources/json/financial/invoice-budgetContract-list_' + taiexContractorId + '.json'
      : '../resources/json/financial/invoice-budgetContract-list_7.json';
    createReadStream(path.join(__dirname, filename)).pipe(res);
  }

  @Get('financial/invoiceBudgetContract/invoice-budgetContract-list/:taiexContractorId/:invoiceDate')
  getInvoiceBudgetContractInvoiceList(@Headers('authorization') authorization: string,
                                      @Param('taiexContractorId') taiexContractorId: number,
                                      @Param('invoiceDate') invoiceDate: string = '',
                                      @Res() res: Response) {
    console.log('Twinning/api/TMS/financial/invoiceBudgetContract/invoice-budgetContract-list - Authorization: ' + authorization +
      ', taiexContractorId: ' + taiexContractorId + ', taiexContractorId: ' + taiexContractorId);
    // Extract payload
    // let jwt = new JWT(authorization);

    const filename = (taiexContractorId === -1)
      ? '../resources/json/financial/invoice-budgetContract-list_' + taiexContractorId + '.json'
      : '../resources/json/financial/invoice-budgetContract-list_7.json';
    createReadStream(path.join(__dirname, filename)).pipe(res);
  }

  @Get('financial/invoiceBudgetContract/invoice-budgetEvent-list/:eventId/:commitmentId')
  listBudgetEvents(@Headers('authorization') authorization: string,
                               @Param('eventId') eventId: number,
                               @Param('commitmentId') commitmentId: number,
                               @Res() res: Response) {
    console.log('Twinning/api/TMS/financial/invoiceBudgetContract/invoice-budgetEvent-list - Authorization: ' + authorization +
      ', eventId: ' + eventId + ', commitmentId: ' + commitmentId);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/financial/invoice-budgetEvent-list.json')).pipe(res);
  }

  @Post('financial/invoiceBudgetContract/invoice-budgetContract-save')
  saveInvoiceBudgetContractList(@Headers('authorization') authorization: string, @Body() body: any): boolean {
    console.log('Twinning/api/TMS/financial/invoiceBudgetContract/invoice-budgetContract-save - Authorization: ' + authorization +
      ', Body: ' + JSON.stringify(body));
    // Extract payload
    // let jwt = new JWT(authorization);

    return true;
  }

  @Get('invoice-budgetContract-print/:taiexContractorId')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  @Header('Content-Disposition', 'attachment; filename=InvoiceBudgetContract_Extract.xlsx')
  extractInvoiceBudgetContractData(@Headers('authorization') authorization: string,
                                   @Param('taiexContractorId') taiexContractorId: number,
                                   @Res() res: Response) {
    console.log('Twinning/api/TMS/invoice-budgetContract-print - Authorization: ' + authorization +
      ', taiexContractorId: ' + taiexContractorId);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/financial/InvoiceBudgetContract_Extract.xlsx')).pipe(res);
  }

  @Get('invoice-budgetContract-print/:taiexContractorId/:invoiceDate')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  @Header('Content-Disposition', 'attachment; filename=InvoiceBudgetContract_Extract.xlsx')
  extractInvoiceBudgetContractInvoiceData(@Headers('authorization') authorization: string,
                                          @Param('taiexContractorId') taiexContractorId: number,
                                          @Param('invoiceDate') invoiceDate: string = '',
                                          @Res() res: Response) {
    console.log('Twinning/api/TMS/invoice-budgetContract-print - Authorization: ' + authorization +
      ', taiexContractorId: ' + taiexContractorId + ', invoiceDate: ' + invoiceDate);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/financial/InvoiceBudgetContract_Extract.xlsx')).pipe(res);
  }

  @Get('financial/invoiceBudgetContract/invoice-budgetContract-report/:taiexContractorId')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  @Header('Content-Disposition', 'attachment; filename=InvoiceBudgetContract_Report.xlsx')
  extractInvoiceBudgetContractReport(@Headers('authorization') authorization: string,
                                     @Param('taiexContractorId') taiexContractorId: number,
                                     @Res() res: Response) {
    console.log('Twinning/api/TMS/financial/invoice-budgetContract-print - Authorization: ' + authorization +
      ', taiexContractorId: ' + taiexContractorId);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/financial/InvoiceBudgetContract_Report.xlsx')).pipe(res);
  }

  @Get('financial/invoiceBudgetContract/invoice-budgetContract-report/:taiexContractorId/:invoiceDate')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  @Header('Content-Disposition', 'attachment; filename=InvoiceBudgetContract_Report.xlsx')
  extractInvoiceBudgetContractInvoiceReport(@Headers('authorization') authorization: string,
                                            @Param('taiexContractorId') taiexContractorId: number,
                                            @Param('invoiceDate') invoiceDate: string = '',
                                            @Res() res: Response) {
    console.log('Twinning/api/TMS/financial/invoice-budgetContract-print - Authorization: ' + authorization +
      ', taiexContractorId: ' + taiexContractorId + ', invoiceDate: ' + invoiceDate);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/financial/InvoiceBudgetContract_Report.xlsx')).pipe(res);
  }

  @Get('financial/invoice/invoice-contractor-list')
  getInvoiceContractorList(@Headers('authorization') authorization: string,
                           @Res() res: Response) {
    console.log('Twinning/api/TMS/financial/invoice/invoice-contractor-list - Authorization: ' + authorization);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/financial/invoice-contractor-list.json')).pipe(res);
  }

  @Get('financial/invoice/invoice-list/:taiexContractorId')
  getInvoiceContractorLists(@Headers('authorization') authorization: string,
                            @Param('taiexContractorId') taiexContractorId: number,
                            @Res() res: Response) {
    console.log('Twinning/api/TMS/financial/invoice/invoice-list - Authorization: ' + authorization +
      ', taiexContractorId: ' + taiexContractorId);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/financial/invoice-list.json')).pipe(res);
  }

  @Get('financial/invoice/invoice-detail/:taiexContractorId/:invoiceId')
  getInvoiceDetail(@Headers('authorization') authorization: string,
                   @Param('taiexContractorId') taiexContractorId: number,
                   @Param('invoiceId') invoiceId: number,
                   @Res() res: Response) {
    console.log('Twinning/api/TMS/financial/invoice/invoice-detail - Authorization: ' + authorization +
      ', taiexContractorId: ' + taiexContractorId + ', invoiceId: ' + invoiceId);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/financial/invoice-detail.json')).pipe(res);
  }

  @Get('financial/invoice/invoice-delete/:invoiceId')
  deleteInvoice(@Headers('authorization') authorization: string,
                @Param('invoiceId') invoiceId: number): boolean {
    console.log('Twinning/api/TMS/financial/invoice/invoice-delete - Authorization: ' + authorization +
      ', invoiceId: ' + invoiceId);
    // Extract payload
    // let jwt = new JWT(authorization);

    return true;
  }

  @Get('invoice-print/:taiexContractorId')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  @Header('Content-Disposition', 'attachment; filename=Invoice_Extract.xlsx')
  extractInvoiceData(@Headers('authorization') authorization: string,
                     @Param('taiexContractorId') taiexContractorId: number,
                     @Res() res: Response) {
    console.log('Twinning/api/TMS/invoice-print - Authorization: ' + authorization +
      ', taiexContractorId: ' + taiexContractorId);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/financial/Invoice_Extract.xlsx')).pipe(res);
  }

  @Get('financial/invoice/invoice-budgetary-listBox/:taiexContractorId/:submittedDate')
  findInvoiceBudgetaryListbox(@Headers('authorization') authorization: string,
                              @Param('taiexContractorId') taiexContractorId: number,
                              @Param('submittedDate') submittedDate: string,
                              @Res() res: Response) {
    console.log('Twinning/api/TMS/financial/invoice/invoice-budgetary-listBox - Authorization: ' + authorization +
      ', taiexContractorId: ' + taiexContractorId + ', submittedDate: ' + submittedDate);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/financial/invoiceBudgetaryListBox.json')).pipe(res);
  }

  @Post('financial/invoice/invoice-set')
  setInvoice(@Headers('authorization') authorization: string,
                                @Body() body: any,
                                @Res() res: Response) {
    console.log('Twinning/api/TMS/financial/invoice/invoice-set - Authorization: ' + authorization);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/financial/invoice-detail.json')).pipe(res);
  }

  @Get('financial/invoice/invoice-verification-amount/:taiexContractorId/:submittedDate')
  fetchInvoiceVerificationAmount(@Headers('authorization') authorization: string,
                              @Param('taiexContractorId') taiexContractorId: number,
                              @Param('submittedDate') submittedDate: string,
                              @Res() res: Response) {
    console.log('Twinning/api/TMS/financial/invoice/invoice-verification-amount - Authorization: ' + authorization +
      ', taiexContractorId: ' + taiexContractorId + ', submittedDate: ' + submittedDate);
    // Extract payload
    // let jwt = new JWT(authorization);

    createReadStream(path.join(__dirname, '../resources/json/financial/invoiceVerificationAmount.json')).pipe(res);
  }
}
